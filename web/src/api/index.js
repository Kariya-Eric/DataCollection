import Vue from 'vue'
import axios from '@/utils/request'

//post
export function postAction(url, param) {
    return axios({
        url, method: 'post', data: param, headers: ''
    })
}