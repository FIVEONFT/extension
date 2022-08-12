export default {
    urls: process.env.NODE_ENV === 'production' ? {
        verifyHolder: `https://five-o.app/verify-holder`,
        verifyHolderFormatted: [`localhost:3000/verify-holder`, `five-o.app/verify-holder`],
        reportsAPI: `https://five-o.app/api/get-reports`,
        refreshLicense: `https://five-o.app/api/refresh-license`
    } : {
        verifyHolder: `http://localhost:3000/verify-holder`,
        verifyHolderFormatted: [`localhost:3000/verify-holder`, `five-o.app/verify-holder`],
        reportsAPI: `http://localhost:3000/api/get-reports`,
        refreshLicense: `http://localhost:3000/api/refresh-license`
    }
};