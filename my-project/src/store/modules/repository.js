const repository = {
    state: {
        repositorySelYear: sessionStorage.getItem('RepositorySelYear') || '',
        repositorySelMenu: JSON.parse(sessionStorage.getItem('RepositorySelMenu')) || null,
        repositorySelForm: JSON.parse(sessionStorage.getItem('RepositorySelForm')) || null
    },
    mutations: {
        SET_REPOSITORYSELYEAR: (state, value) => {
            sessionStorage.setItem('RepositorySelYear', value)
            state.repositorySelYear = value
        },
        SET_REPOSITORYSELMENU: (state, value) => {
            sessionStorage.setItem('RepositorySelMenu', JSON.stringify(value))
            state.repositorySelMenu = value
        },
        SET_REPOSITORYSELFORM: (state, value) => {
            sessionStorage.setItem('RepositorySelForm', JSON.stringify(value))
            state.repositorySelForm = value
        }
    }
}

export default repository
