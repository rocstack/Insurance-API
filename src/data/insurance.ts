import { PolicyDocument } from '../models/policy';

export type AgeBands = {
  st: Array<AgeBand>;
  at: Array<AgeBand>;
  ls: Array<AgeBand>;
};

export type AgeBand = {
  band: number;
  minAge: number;
  maxAge: number;
};

export type Endorsement = {
  name: string;
  fullName: string;
  calculateGross: (policy: PolicyDocument, product: string) => number;
  calculateNTU: (policy: PolicyDocument, product: string) => number;
};

export enum Type {
	SingleTrip = 'st',
	AnnualTrip = 'at',
	LongStay = 'ls',
}

// Product types
export enum Product {
  Silver = 'silver',
  Gold = 'gold',
  Platinum = 'platinum',
}

// Age bands per policy type
export const ageBands: AgeBands = {
  [Type.SingleTrip]: [
    { band: 0, minAge: 0, maxAge: 17 } as AgeBand,
    { band: 1, minAge: 18, maxAge: 49 } as AgeBand,
    { band: 2, minAge: 50, maxAge: 60 } as AgeBand,
  ],
  [Type.AnnualTrip]: [
    { band: 0, minAge: 0, maxAge: 17 } as AgeBand,
    { band: 1, minAge: 18, maxAge: 49 } as AgeBand,
    { band: 2, minAge: 50, maxAge: 60 } as AgeBand,
  ],
  [Type.LongStay]: [
    { band: 0, minAge: 0, maxAge: 17 } as AgeBand,
    { band: 1, minAge: 18, maxAge: 49 } as AgeBand,
    { band: 2, minAge: 50, maxAge: 60 } as AgeBand,
  ],
};

// Endorsements
export const endorsements: Array<Endorsement> = [
  {
    name: 'activityPack2',
    fullName: 'Activity Pack 2',
    calculateGross: function (policy: PolicyDocument, product: Product) {
      return policy.quoteCosts[product].gross * 0.5;
    },
    calculateNTU: function (policy: PolicyDocument, product: Product) {
      return policy.quoteCosts[product].ntu * 0.5;
    },
  } as Endorsement,
];
