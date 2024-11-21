import { Types } from "mongoose";
import { IJournalist } from "../../custom";
import { JournalistModel } from "../database/db";

const createJournalistRepositories = (body: IJournalist): Promise<IJournalist> => JournalistModel.create(body);

const findAllJournalistRepositories = (): Promise<IJournalist[]> => JournalistModel.find();

const findByEmailRepositories = (email: string): Promise<IJournalist | null> => JournalistModel.findOne({ email: email });

const findJournalistByIdRepositories = (journalistId: Types.ObjectId): Promise<IJournalist | null> => JournalistModel.findById(journalistId);

const updateJournalistRepositories = (journalistId:  Types.ObjectId, body: IJournalist): Promise<IJournalist | null> => JournalistModel.findOneAndUpdate(
    { _id: journalistId },
    {...body }, { new: true }
);

export default {
    createJournalistRepositories,
    findAllJournalistRepositories,
    findByEmailRepositories,
    findJournalistByIdRepositories,
    updateJournalistRepositories
};