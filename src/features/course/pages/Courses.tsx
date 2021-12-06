import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'

import AppPage from 'components/AppPage'
import { useFetch, FetchState, FetchContent } from 'hooks/useFetch'
import { PageComponent } from 'utils/params'
import { SendError } from 'features/error-messages'

import { COURSE_PAGE_PATH } from '../utils/params'
import { Course } from '../types/course'

export default PageComponent.from(
    function CoursePage({ code }) {
        const content = useFetch(code, Course.fetch)
        return (
            <AppPage title={content.data?.name ?? code}>
                <CourseContent code={code} content={content} />
            </AppPage>
        )
    },
    { path: COURSE_PAGE_PATH },
)

interface CourseContentProps {
    code: string
    content: FetchContent<Course>
}

const CourseContent = React.memo(
    function CourseContent({ code, content }: CourseContentProps) {
        if (content.state !== FetchState.Error) {
            return <>{content.data?.name}<Outlet /></>
        } else if (content.is404) {
            return <Navigate to="/404" replace />
        } else {
            return (
                <SendError kind="course-page" severe>
                    Problema de conexão com o servidor: os dados do curso {code} não puderam
                    ser recuperados. Por favor, cheque sua conexão com a internet ou tente
                    novamente mais tarde.
                </SendError>
            )
        }
    },
    (prev, next) => (
        prev.code === next.code && prev.content.state === next.content.state
    ),
)
