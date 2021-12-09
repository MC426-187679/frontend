import React, { type ReactNode } from 'react'
import { Outlet } from 'react-router-dom'
import { Card, CardContent, Skeleton, Typography } from '@mui/material'
import { css } from '@emotion/css'

import type { Course } from '../types/course'
import { VariantSelect } from './VariantSelect'

/** Classe CSS que limita o tamanho mínimo do componente. */
const withMinWidth = css`
    min-width: 32ch;
`

interface CourseCardProps {
    course?: Course
}

export default function CourseCard({ course }: CourseCardProps) {
    return (
        <Card className={withMinWidth} color="inherit" raised>
            <CardContent component="article" aria-labelledby="course-header">
                {/* Nome e código. */}
                <CourseHeader id="course-header" name={course?.name} code={course?.code} />
                {/* Seletor de modalidade. */}
                {course
                    ? <VariantSelect code={course.code} options={course.variants} />
                    : <Skeleton />}
                {/* Árvore. */}
                <section aria-labelledby="suggestion">
                    <SectionHeader id="suggestion">
                        Árvore Sugerida:
                    </SectionHeader>
                    <Outlet />
                </section>
            </CardContent>
        </Card>
    )
}

interface CourseHeaderProps {
    id: string
    name?: string | undefined
    code?: string | undefined
}

const inline = css`
    display: inline;
`

function CourseHeader({ id, name, code }: CourseHeaderProps) {
    if (name && code) {
        return (
            <Typography variant="h4" id={id} component="div">
                { name } <Typography variant="h5" className={inline}>(Curso {code})</Typography>
            </Typography>
        )
    } else {
        return (
            <Typography variant="h4" id={id} component="div">
                <Skeleton />
            </Typography>
        )
    }
}

/** {@link Typography} com formatação de header e com margem. */
function SectionHeader({ children, id }: { children?: ReactNode, id: string }) {
    return (
        <Typography
            id={id}
            variant="h6"
            color="text.secondary"
            marginTop="1ex"
            marginBottom="0.5ex"
        >
            { children }
        </Typography>
    )
}
