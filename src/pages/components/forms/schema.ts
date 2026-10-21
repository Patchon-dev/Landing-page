import * as yup from 'yup';

export interface UserFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  bio: string;
  accepted: boolean;
}

export const initialUserValues: UserFormValues = { name: '', email: '', password: '', confirmPassword: '', bio: '', accepted: false };

export function createUserSchema(t: (key: string) => string) {
  return yup.object({
    name: yup.string().trim().min(2, t('formsNameMin')).max(80, t('formsNameMax')).required(t('formsRequired')),
    email: yup.string().trim().email(t('formsEmailInvalid')).max(120, t('formsEmailMax')).required(t('formsRequired')),
    password: yup.string().min(8, t('formsPasswordMin')).matches(/[a-z]/, t('formsPasswordLower')).matches(/[A-Z]/, t('formsPasswordUpper')).matches(/[0-9]/, t('formsPasswordNumber')).required(t('formsRequired')),
    confirmPassword: yup.string().required(t('formsRequired')).oneOf([yup.ref('password')], t('formsPasswordMatch')),
    bio: yup.string().max(500, t('formsBioMax')),
    accepted: yup.boolean().oneOf([true], t('formsAcceptRequired')).required(),
  });
}
