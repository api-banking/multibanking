import {
  airBank,
  csas,
  csob,
  equa,
  kb,
  mBank,
  moneta,
  raiffeisenbank,
} from '../assets/images'

const banks = {
  '0300': {
    code: '0300',
    name: 'Československá obchodní banka',
    shortName: 'ČSOB',
    logo: csob,
  },
  '5500': {
    code: '5500',
    name: 'Raiffeisen‎',
    shortName: 'Raiffeisen‎',
    logo: raiffeisenbank,
  },
  '0800': {
    code: '0800',
    name: 'Česká spořitelna',
    shortName: 'ČSAS',
    logo: csas,
  },
  '0600': { code: '0600', name: 'Moneta', shortName: 'Moneta', logo: moneta },
  '3030': {
    code: '3030',
    name: 'Air Bank',
    shortName: 'Air Bank',
    logo: airBank,
  },
  '6100': {
    code: '6100',
    name: 'Equa',
    shortName: 'Equa',
    logo: equa,
  },
  '0100': {
    code: '0100',
    name: 'Komerční banka',
    shortName: 'KB',
    logo: kb,
  },
  '6210': {
    code: '6210',
    name: 'mBank',
    shortName: 'mBank',
    logo: mBank,
  },
}

const getLogo = bankCode => banks[bankCode] && banks[bankCode].logo

export { getLogo, banks }
