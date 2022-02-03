import { Document, Model, model, Schema } from "mongoose";
import { IUser } from "./User";

/**
 * Interface to model the Profile Schema for TypeScript.
 * @param user:ref => User._id
 * @param firstName:string
 * @param lastName:string
 * @param username:string
 */
export interface IProfile extends Document {
  user: IUser["_id"];
  firstName: string;
  lastName: string;
  username: string;
  accessToken: string;
  provider: string;
  providerId: string;
  displayName: string;
}

const profileSchema: Schema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  providerId: {
    type: String,
    required: true
  },
  provider:{
    type: String
  },
  displayName: {
    type: String
  },
  accessToken:{
    type: String
  },
  response: {
    type: Object
  },
  date: {
    type: Date,
    default: Date.now
  }
});

export default model<IProfile>("Profile", profileSchema);
