import axios from 'axios'

export function sendEmail(params:any){
    return axios.post('/third-login/sendEmail',params)
}
