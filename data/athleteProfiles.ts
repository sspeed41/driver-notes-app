export interface AthleteProfile {
  age: number;
  gymTime: string;
  crewChief: string;
  spotter: string;
  phone: string;
  email: string;
  birthday: string;
}

export const athleteProfiles: { [key: string]: AthleteProfile } = {
  'Kyle Larson': {
    age: 32,
    gymTime: 'FLEX',
    crewChief: 'Cliff Daniels',
    spotter: 'Tyler Mon',
    phone: '7043088150',
    email: 'k@kylelarsonracing.com',
    birthday: '7/31/1992'
  },
  'Alex Bowman': {
    age: 32,
    gymTime: '7:30',
    crewChief: 'Blake Harris',
    spotter: 'Kevin Hamlin',
    phone: '5206093435',
    email: 'Awb55@me.com',
    birthday: '4/25/1993'
  },
  'Ross Chastain': {
    age: 32,
    gymTime: '7:00',
    crewChief: 'Phil Surgen',
    spotter: 'Brandon McReynolds',
    phone: '2396336239',
    email: 'Ross@rosschastain.com',
    birthday: '12/4/1992'
  },
  'Daniel Suarez': {
    age: 33,
    gymTime: '7:00',
    crewChief: 'Matt Swiderski',
    spotter: 'Frankie Kimmel',
    phone: '7044906943',
    email: 'daniel@danielsuarezracing.com',
    birthday: '1/7/1992'
  },
  'Austin Dillon': {
    age: 35,
    gymTime: 'FLEX',
    crewChief: 'Richard Boswell',
    spotter: 'Brandon Bedisch',
    phone: '3366180868',
    email: 'adillon@rcrracing.com',
    birthday: '4/27/1990'
  },
  'Connor Zilisch': {
    age: 18,
    gymTime: '8:00',
    crewChief: 'Mardi Lindley',
    spotter: 'Josh Williams',
    phone: '7049896020',
    email: 'connorz722@gmail.com',
    birthday: '7/22/2006'
  },
  'Carson Kvapil': {
    age: 22,
    gymTime: '8:30',
    crewChief: 'Andrew Overstreet',
    spotter: 'TJ Majors',
    phone: '7047758625',
    email: 'carsonkvapil35@icloud.com',
    birthday: '5/22/2003'
  },
  'Austin Hill': {
    age: 31,
    gymTime: '9:00',
    crewChief: 'Chad Haney',
    spotter: 'Derek Williams',
    phone: '6784475920',
    email: 'austin@austinhillracing.com',
    birthday: '4/21/1994'
  },
  'Jesse Love': {
    age: 20,
    gymTime: '9:00',
    crewChief: 'Danny Stockman',
    spotter: 'Brandon Bedisch',
    phone: '6507224002',
    email: 'jesse@jesseloveracing.com',
    birthday: '1/14/2005'
  },
  'Nick Sanchez': {
    age: 23,
    gymTime: '7:30',
    crewChief: 'Patrick Donahue',
    spotter: '',
    phone: '7862576737',
    email: 'Nicksanchez080@gmail.com',
    birthday: '6/10/2001'
  },
  'Daniel Dye': {
    age: 21,
    gymTime: '6:30',
    crewChief: '',
    spotter: '',
    phone: '3868465451',
    email: 'daniel@danieldyeracing.com',
    birthday: '12/4/2003'
  },
  'Grant Enfinger': {
    age: 40,
    gymTime: '9:00',
    crewChief: 'Jeff Stankiewicz',
    spotter: '',
    phone: '2514545211',
    email: 'grantenfinger@yahoo.com',
    birthday: '1/22/1985'
  },
  'Daniel Hemric': {
    age: 34,
    gymTime: '11:00',
    crewChief: '',
    spotter: '',
    phone: '9805218414',
    email: 'DanielHemric@outlook.com',
    birthday: '1/27/1991'
  },
  'Connor Mosack': {
    age: 26,
    gymTime: '8:00',
    crewChief: 'Blake Bainbridge',
    spotter: '',
    phone: '7047563691',
    email: 'connormosack@gmail.com',
    birthday: '1/20/1999'
  },
  'Kaden Honeycutt': {
    age: 21,
    gymTime: '9:30',
    crewChief: 'Phil Gould',
    spotter: 'Stevie Reves?',
    phone: '4097193218',
    email: 'Kaden.Honeycutt@yahoo.com',
    birthday: '6/23/2003'
  },
  'Rajah Caruth': {
    age: 22,
    gymTime: '8:00',
    crewChief: '?',
    spotter: '',
    phone: '2028265236',
    email: 'rc13racing@gmail.com',
    birthday: '6/11/2002'
  },
  'Andres Perez': {
    age: 20,
    gymTime: '10:00',
    crewChief: '',
    spotter: '',
    phone: '9802674057',
    email: 'andres.plg.mx@gmail.com',
    birthday: '4/2/2005'
  },
  'Matt Mills': {
    age: 28,
    gymTime: '10:30',
    crewChief: 'mike shiplet',
    spotter: 'TJ majors',
    phone: '3304475725',
    email: 'mattmillsracing@yahoo.com',
    birthday: '11/14/1996'
  },
  'Dawson Sutton': {
    age: 17,
    gymTime: '7:30',
    crewChief: 'Chad Kendricks',
    spotter: 'Bruce Danz',
    phone: '6154892352',
    email: 'dawson@rackleywar.com',
    birthday: '1/26/2008'
  },
  'Tristan McKee': {
    age: 14,
    gymTime: '7:00',
    crewChief: 'piercy',
    spotter: '',
    phone: '7579688664',
    email: 'mckeetristan03@gmail.com',
    birthday: '8/3/2010'
  },
  'Helio Meza': {
    age: 17,
    gymTime: '9:00',
    crewChief: 'Hixon MXCUP+MX nasgar',
    spotter: '',
    phone: '2816600726',
    email: 'hmezza27@gmail.com',
    birthday: '11/27/2007'
  },
  'Corey Day': {
    age: 19,
    gymTime: '11:00',
    crewChief: '',
    spotter: '',
    phone: '5593601505',
    email: 'coreyaday41@gmail.com',
    birthday: '11/28/2005'
  },
  'Ben Maier': {
    age: 16,
    gymTime: '9:00',
    crewChief: 'setzer',
    spotter: '',
    phone: '4438271176',
    email: 'ben67racer@gmail.com',
    birthday: '12/28/2008'
  },
  'Tyler Reif': {
    age: 17,
    gymTime: '11:00',
    crewChief: 'beam',
    spotter: '',
    phone: '7027415572',
    email: 'tylerreif@outlook.com',
    birthday: '6/5/2007'
  },
  'Brenden Queen': {
    age: 27,
    gymTime: '9:30',
    crewChief: 'shane huffman',
    spotter: '',
    phone: '7574775730',
    email: 'Brendenqueen@gmail.com',
    birthday: '11/21/1997'
  }
}; 