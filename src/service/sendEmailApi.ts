import axios from 'axios'

export interface SendEmailParams {
  toUserEmail: string;
  title: string;
  content: string;
}

export interface SendEmailResponse {
  data: {
    code: number;
    msg: string;
  };
}

export function sendEmail(params: SendEmailParams): Promise<SendEmailResponse> {
  return axios.post('/third-login/sendEmail', params)
}
