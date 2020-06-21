import mongoose, { model, Schema, Document } from 'mongoose';
import { AppError } from '../middleware/error-handler';

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
  quoteCosts: Array<QuoteCost>;
  endorsements: string[];
  status: string;
  generatePolicyNumber: () => void;
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
policySchema.methods.generatePolicyNumber = async function () {
  try {
    const prevPolicy = (await mongoose
      .model('Policy')
      .findOne()
      .sort({ createdAt: 'desc' })) as PolicyDocument;

    // Add to previous policy number
    if (prevPolicy) {
      this.number = prevPolicy.number + 1;
    } else {
      throw AppError('No previous policies found');
    }
  } catch (err) {
    throw err;
  }
};

export const Policy = model<PolicyDocument>('Policy', policySchema);
