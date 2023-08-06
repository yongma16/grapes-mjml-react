import axios from 'axios'

export function sendEmail(params:any){
    return axios.post('/sendEmail',params)
}
