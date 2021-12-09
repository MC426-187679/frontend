import React from 'react'
import { Navigate } from 'react-router-dom'

import { useFetch, FetchState } from 'hooks/useFetch'
import { PageComponent } from 'utils/params'
import { SendError } from 'features/error-messages'

import { COURSE_PAGE_PATH } from '../utils/params'
import { Tree } from '../types/course'
import TreeGrid from '../components/TreeGrid'

export default PageComponent.from(
    function CourseTreePage({ code, variant }) {
        const content = useFetch([code, variant], Tree.fetch, undefined, [code, variant])

        if (content.state !== FetchState.Error) {
            return <TreeGrid tree={content.data} />
        } else if (content.is404) {
            return <Navigate to="/404" replace />
        } else {
            return (
                <SendError kind="course-page" severe>
                    Problema de conexão com o servidor: os dados da modalidade {variant} não
                    puderam ser recuperados. Por favor, cheque sua conexão com a internet ou
                    tente novamente mais tarde.
                </SendError>
            )
        }
    },
    { path: `${COURSE_PAGE_PATH}/:variant`, subPath: ':variant' as const },
)
