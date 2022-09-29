const forceLiveURLs = true;

export default {
    urls: process.env.NODE_ENV === 'production' || forceLiveURLs ? {
        verifyHolder: `https://five-o.app/verify-holder`,
        verifyHolderFormatted: [`localhost:3000/verify-holder`, `five-o.app/verify-holder`],
        reportsAPI: `https://five-o.app/api/get-reports`,
        safeSitesAPI: `https://five-o.app/api/get-safe-sites`,
        refreshLicense: `https://five-o.app/api/refresh-license`
    } : {
        verifyHolder: `http://localhost:3000/verify-holder`,
        verifyHolderFormatted: [`localhost:3000/verify-holder`, `five-o.app/verify-holder`],
        reportsAPI: `http://localhost:3000/api/get-reports`,
        safeSitesAPI: `https://localhost:3000/api/get-safe-sites`,
        refreshLicense: `http://localhost:3000/api/refresh-license`
    }
};