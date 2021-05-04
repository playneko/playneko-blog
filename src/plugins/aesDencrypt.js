import Vue from 'vue'
import vueCryptojs from 'vue-cryptojs'
Vue.use(vueCryptojs)

const aesDencrypt = (secretKey, iv, text) => {
    const cipher = Vue.CryptoJS.AES.decrypt(text, secretKey, {
        iv: iv,
        mode: Vue.CryptoJS.mode.CBC,
        padding: Vue.CryptoJS.pad.ZeroPadding
    });
    return cipher.toString(Vue.CryptoJS.enc.Utf8)
}

export default aesDencrypt;