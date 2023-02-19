const forceLiveURLs = false;

export default {
    roles: [
        '1070429632010133615', // first lieut
        '1070429499646300261', // lieut
        '1005096398007582791' // second lieut
    ],
    roleToName: {
        '1070429632010133615': 'First Lieutenant',
        '1070429499646300261': 'Lieutenant',
        '1005096398007582791': 'Second Lieutenant'
    },
    extUrl: 'https://chrome.google.com/webstore/detail/five-o-web-protection/findleoghfonpfjbofjmogljkhjkecbo',
    urls: process.env.NODE_ENV === 'production' || forceLiveURLs ? {
        verifyHolder: `https://five-o.app/verify-holder`,
        verifyHolderFormatted: [`localhost:3000/verify-holder`, `five-o.app/verify-holder`],
        reportsAPI: `https://five-o.app/api/get-reports`,
        safeSitesAPI: `https://five-o.app/api/get-safe-sites`,
        warnSitesAPI: `https://five-o.app/api/get-warn-sites`,
        refreshLicense: `https://five-o.app/api/refresh-license`,
        submitReportExt: `https://five-o.app/api/submit-report-ext`
    } : {
        verifyHolder: `http://localhost:3000/verify-holder`,
        verifyHolderFormatted: [`localhost:3000/verify-holder`, `five-o.app/verify-holder`],
        reportsAPI: `http://localhost:3000/api/get-reports`,
        safeSitesAPI: `http://localhost:3000/api/get-safe-sites`,
        warnSitesAPI: `http://localhost:3000/api/get-warn-sites`,
        refreshLicense: `http://localhost:3000/api/refresh-license`,
        submitReportExt: `http://localhost:3000/api/submit-report-ext`
    }
};