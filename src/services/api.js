import apiClient from './auth';

export default {
    // Get Qurea Center Status (Big Number)
    getQureaStation() {
        return apiClient.get('/admin/QureaElectronics/QureaStation');
    },

    // Get List of Offices
    getOfficeCrs() {
        return apiClient.get('/admin/QureaElectronics/OfficeCrs');
    },

    // Get List of Coordinations
    getCoordinations() {
        return apiClient.get('/admin/QureaElectronics/Coordinations');
    },

    // Get Winners for a specific office
    getOfficeWinners(officeCrId) {
        return apiClient.get(`/admin/QureaElectronics/OfficeCrs/${officeCrId}`);
    },

    // Get Registers for a specific office (with pagination)
    getRegisters(officeCrId, pageNumber = 1, pageSize = 1000) {
        return apiClient.get(`/admin/QureaElectronics/Registes/${officeCrId}`, {
            params: {
                PageNumber: pageNumber,
                PageSize: pageSize
            }
        });
    },

    // Start/Create Qurea for an office (POST)
    startQurea(officeCrId) {
        return apiClient.post(`/admin/QureaElectronics/InitialQurea/${officeCrId}`);
    },

    getIndicators() {
        return apiClient.get('/admin/QureaElectronicsIndicators');
    },

    exportcsv() {
        return apiClient.post('/admin/PersonRegisterdForHaj/ExtractCsv')
    },

    getQureaStatus() {
        return apiClient.get('/admin/QureaElectronics/status')
    },

    getQureaStatusindicators() {
        return apiClient.get('/admin/QureaElectronicsIndicators/status')
    },
    startQureaStatus() {
        return apiClient.post('/admin/QureaElectronicsIndicators/status')
    },

    getIndicatorsStation() {
        return apiClient.get('/admin/QureaElectronicsIndicators/Station')
    },

    postkey(data) {
        return apiClient.post('/admin/QureaElectronicsIndicators/QureaTokenKeys', data)
    },
    getkey() {
        return apiClient.get('/admin/QureaElectronicsIndicators/QureaTokenKeys')
    },
    getTime() {
        return apiClient.get('/admin/QureaElectronics/datetime')
    },
    getTimeindicators() {
        return apiClient.get('/admin/QureaElectronicsIndicators/datetime')
    }
}
