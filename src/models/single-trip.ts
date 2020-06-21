import mongoose, { model, Types, Schema, Document } from 'mongoose';

import { Policy, PolicyDocument } from './policy';

const singleTripSchema = new Schema({});

// Query and update costs
// singleTripSchema.methods.quote = async function () {
//   try {
//     const costs = await mongoose
//       .model('Insurance-Cost')
//       .findByPolicyParams(this.type, this.area, this.tripDuration);
//     // Populate quoteCosts child document
//     costs.forEach((cost) => {
//       let gross = 0;
//       let ntu = 0;
//       // Relationship
//       switch (this.relationship) {
//         case 'individual':
//           gross = cost.individualGross;
//           ntu = cost.individualNTU;
//           break;
//         case 'couple':
//           gross = cost.coupleGross;
//           ntu = cost.coupleNTU;
//           break;
//         default:
//           const error = new Error('Passed relationship not recognised');
//           error.statusCode = 422;
//           reject(error);
//       }
//       // Populate quote document
//       this.quoteCosts[cost.product] = {
//         gross: gross,
//         ntu: ntu,
//       };
//     });
//   } catch (err) {
//     throw err;
//   }
// };

export default Policy.discriminator<PolicyDocument>('SingleTrip', singleTripSchema);
