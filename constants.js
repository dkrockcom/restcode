module.exports = {
    controller: {
        action: {
            SAVE: 'SAVE',
            LOAD: 'LOAD',
            LIST: 'LIST',
            DELETE: 'DELETE',
            EXPORT: 'EXPORT'
        },
        exportType: {
            EXCEL: 'EXCEL',
            CSV: 'CSV',
            PDF: 'PDF'
        },
        responseKey: {
            SUCCESS: 'success',
            MESSAGE: 'message',
            DATA: 'data'
        },
        defaultProperties: {
            createdBy: 'CreatedByUserId',
            modifiedBy: 'ModifiedByUserId'
        }
    },
    messages: {
        INVALID_ACTION: 'Invalid action.',
        UNAUTHORIZED_ACCESS: 'Unauthorized Access',
        SESSION_EXPIRED: 'Session has expired'
    },
    ROLE: {
        SUPER_ADMIN: 0,
        ADMIN: 1,
        USER: 2
    }
}