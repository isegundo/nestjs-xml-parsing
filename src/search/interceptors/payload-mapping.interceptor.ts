
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import * as _ from 'lodash';
import * as objectMapper from 'object-mapper';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import * as xml2js from 'xml2js';


const stripPrefix = xml2js.processors.stripPrefix
const firstCharLowerCase = xml2js.processors.firstCharLowerCase

/**
* O conteúdo textual de um elemento estará dentro do campo _
* Os atributos estarão dentro de um objeto $
* Tudo será array
*/
const restrictedSettings = {
  explicitArray: true, // true faz com que sempre transforme em um array, mesmo que só tenha um elemento
  explicitCharkey: true, // sempre coloca o conteúdo textual de um elemento dentro do campo "_"
  mergeAttrs: false,
  normalize: false, // Trim whitespaces inside text nodes
  normalizeTags: false, // Normalize all tag names to lowercase.
  trim: false, // Trim the whitespace at the beginning and end of text nodes.
  tagNameProcessors: [stripPrefix, firstCharLowerCase], // Processors para os nomes de TAG
  attrNameProcessors: [firstCharLowerCase] // Processors para os nomes de ATTRIBUTES
}

const parser = new xml2js.Parser(restrictedSettings)

const builder = new xml2js.Builder({
  trim: false
})

// TODO mover mappingRS e addNamespaces para outro arquivo
const mappingRS = {
  'count': 'soapenv:Envelope.soapenv:Body.Count._',
  'hotels[].name': 'soapenv:Envelope.soapenv:Body.Hotels.Hotel[].$.Name',
  'hotels[].rooms[].name': 'soapenv:Envelope.soapenv:Body.Hotels.Hotel[].ListRooms.Room[].$.Name',
  'hotels[].rooms[].price': 'soapenv:Envelope.soapenv:Body.Hotels.Hotel[].ListRooms.Room[].$.Price'
}

const mappingRQ = {
  'envelope.body[0].name[0]._': 'name',
  'envelope.body[0].notes[0]._': 'notes',
  'envelope.body[0].filter[0].param1[0]._': {
    key: 'filter.param1',
    transform: x => Number(x) //TODO usar o class-transformer no DTO ao invés disso
  },
  'envelope.body[0].filter[0].param2[0]._': 'filter.param2',
  'envelope.body[0].filter[0].date[0]._': 'filter.date',
  'envelope.body[0].filter[0].subs[0].subParam1[]._': 'filter.subs[].subParam1',
}


const addNamespaces = response => {
  response['soapenv:Envelope'].$ = {
    'xmlns:soapenv': 'http://schemas.xmlsoap.org/soap/envelope/',
    'xmlns:ser': 'http://www.isegundo.com.br/Services',
    'xmlns:com': 'http://www.isegundo.com.br/Common',
    'xmlns:book': 'http://www.isegundo.com.br/Booking',
    'xmlns:prod': 'http://www.isegundo.com.br/Product',
    'xmlns:air': 'http://www.isegundo.com.br/Airport',
    'xmlns:hel': 'http://www.isegundo.com.br/Heliport',
    'xmlns:ord': 'http://www.isegundo.com.br/Order'
  }
  return response
}

const mapResponse = response => {
  const originalResponse = _.cloneDeep(response)
  const remappedResponse = objectMapper(originalResponse, mappingRS)
  const responseWithNamespaces = addNamespaces(remappedResponse)

  const xmlResponse = builder.buildObject(responseWithNamespaces)
  return xmlResponse
}

const mapRequest = async data => {
  // TODO fazer um fail fast se o XML estiver malformado
  return parser.parseStringPromise(data)
    .then(function (parsedXml) {
      const originalBody = _.cloneDeep(parsedXml)
      const remappedBody = objectMapper(originalBody, mappingRQ)
      return remappedBody
    })
}

export interface Response<T> {
  data: T;
}

@Injectable()
export class PayloadMappingInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {

    // Getting the request object
    let request = context.switchToHttp().getRequest();

    // Mapping XMl to JS object (not the Typescript classes yet)
    request.body = mapRequest(request.body)

    // Handling to Controller and mapping response back to XML
    return next.handle()
      .pipe(
        map(mapResponse)
      );
  }
}
