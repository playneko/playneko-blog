import Vue from 'vue'
import vueCryptojs from 'vue-cryptojs'
Vue.use(vueCryptojs)

const aesEncrypt = (secretKey, iv, text) => {
    let srcs = Vue.CryptoJS.enc.Utf8.parse(JSON.stringify(text));
    const cipher = Vue.CryptoJS.AES.encrypt(srcs, secretKey, {
        iv: iv,
        mode: Vue.CryptoJS.mode.CBC,
        padding: Vue.CryptoJS.pad.Pkcs7
    })
    return Vue.CryptoJS.enc.Base64.stringify(cipher.ciphertext)
}

export default aesEncrypt;