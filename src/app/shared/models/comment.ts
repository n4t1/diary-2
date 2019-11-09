import { TypeEnum } from './enums';

export interface Comment {
    id?: string;
    message: string;
    user_name: string;
    user_id: string;
    mats_id: number;
    mats_type: TypeEnum;
    date: string;
}
