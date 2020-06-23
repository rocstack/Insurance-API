import mongoose, { model, Schema, Document } from 'mongoose';
import moment from 'moment';
import { AppError } from '../middleware/error-handler';
import { Type, Product, ageBands, AgeBand } from '../data/insurance';

// Interfaces
type QuoteCost = {
  insuranceCost: mongoose.Types.ObjectId;
  silver: { gross: number; ntu: number };
  gold: { gross: number; ntu: number };
  platinum: { gross: number; ntu: number };
};

type Passenger = {
  passenger: mongoose.Types.ObjectId;
  ageAtQuote: number;
  ageBand: number;
};

export type PolicyDocument = Document & {
  number: number;
  type: string;
  product: string;
  relationship: string;
  area: string;
  issueDate: Date;
  startDate: Date;
  endDate: Date;
  tripDuration: number;
  ageBandUsed: number;
  passengers: Array<Passenger>;
  quoteCosts: QuoteCost;
  endorsements: string[];
  status: string;
  generatePolicyNumber: () => Promise<void>;
  calcTripDuration: () => Promise<number>;
  calculateAgeBands: (ages: number[]) => Promise<void>;
};

// MongoDB Scheme
const policySchema = new Schema(
  {
    number: { type: Number, unique: true, min: 0, required: true },
    type: { type: String, enum: ['st', 'at', 'ls'] },
    product: { type: String, enum: ['silver', 'gold', 'platinum'] },
    relationship: { type: String, enum: ['individual', 'couple', 'family'] },
    area: { type: String, enum: ['uk', 'euro', 'wwinc', 'wwexc', 'ausnz'] },
    issueDate: { type: Date, default: Date.now },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    tripDuration: Number,
    ageBandUsed: Number,
    passengers: [
      {
        passenger: { type: mongoose.Types.ObjectId, ref: 'Passenger' },
        ageAtQuote: { type: Number, required: true },
        ageBand: { type: Number, required: true },
      },
    ],
    quoteCosts: {
      insuranceCost: { type: mongoose.Types.ObjectId, ref: 'Insurance-Cost' },
      silver: { gross: Number, ntu: Number },
      gold: { gross: Number, ntu: Number },
      platinum: { gross: Number, ntu: Number },
    },
    endorsements: [String],
    status: {
      type: String,
      default: 'quote',
      enum: ['quote', 'policy', 'cancelled'],
      required: true,
    },
  },
  { timestamps: true }
);

// Work out the next policy number
policySchema.methods.generatePolicyNumber = async function (): Promise<void> {
  try {
    const prevPolicy = (await mongoose
      .model('Policy')
      .findOne()
      .sort({ createdAt: 'desc' })) as PolicyDocument;
    // Add to previous policy number
    this.number = prevPolicy ? prevPolicy.number + 1 : 1000;
  } catch (err) {
    throw err;
  }
};

// Calculate policy duration
policySchema.methods.calcTripDuration = async function (): Promise<number> {
  const startDate = moment(this.startDate);
  const endDate = moment(this.endDate);
  // Calculate policy duration
  const tripDuration = moment.duration(endDate.diff(startDate)).asDays();
  // Check duration
  if (this.type === 'at' && tripDuration !== 365) {
    throw AppError('Wrong policy duration for an AT policy', 422);
  } else if (tripDuration <= 0) {
    throw AppError('Trip duration needs to be at least a day');
  }
  this.tripDuration = tripDuration;
  return tripDuration;
};

// Calculate age bands and create passenger document
policySchema.methods.calculateAgeBands = async function (
  ages: number[]
): Promise<void> {
  // Make sure ages are passed in
  if (ages.length === 0) {
    throw AppError('No ages passed in', 422);
  }
  // Create passenger document with correct age bands
  this.passengers = ages.map((age) => {
    // Find age band in current loop
    const ageBand = ageBands[this.type as Type].find((band: AgeBand) => {
      return age >= band.minAge && age <= band.maxAge;
    });

    if (ageBand) {
      return {
        ageAtQuote: age,
        ageBand: ageBand.band,
      };
    } else {
      throw AppError('Age band not found');
    }
  });
  // Age band array
  const bands = this.passengers.map((passenger: Passenger) => {
    return passenger.ageBand;
  });
  // Lowest age band
  this.ageBandUsed = Math.min(...bands);
};

export const Policy = model<PolicyDocument>('Policy', policySchema);
