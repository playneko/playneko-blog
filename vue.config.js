module.exports = {
    devServer: {
        // 프록시 설정
        proxy: {
            // 프록시 요청을 보낼 api의 시작 부분
            '/api': {
                // 프록시 요청을 보낼 서버의 주소
                // target: 'http://ec2-54-249-69-88.ap-northeast-1.compute.amazonaws.com:8090'
                target: 'http://localhost:8090'
                // target: 'https://playneko.com:8090'
            },
            '/oauth/authorize': {
                target: 'https://kauth.kakao.com/oauth/authorize',
                changeOrigin: true,
                pathRewrite: {
                    '^/oauth/authorize': ''
                }
            },
            '/v2/user/me': {
                target: 'https://kapi.kakao.com/v2/user/me',
                changeOrigin: true,
                pathRewrite: {
                    '^/v2/user/me': ''
                }
            }
        }
    }
};