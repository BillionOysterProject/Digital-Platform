#!/usr/bin/env bash
trap exit INT TERM

for role in 'team lead pending' 'team member pending'; do
    export ROLE="${role}"
    export ORG=''

    if [[ "${role}" == 'team lead pending' ]]; then
        for teamLeadType in 'teacher' 'partner' 'citizen scientist' 'professional scientist' 'other'; do
            export LEAD_TYPE="${teamLeadType}"

            if [[ "${teamLeadType}" == 'teacher' ]]; then
                for teacherType in 'nyc-public' 'nyc-charter' 'private' 'other-public'; do
                    if [[ "${teacherType}" == 'nyc-public' ]]; then
                        export ORG='Central Park East II'
                    fi

                    export TEACHER_TYPE="${teacherType}"

                    webfriend -D signup.fs
                done
            else
                webfriend -D signup.fs
            fi
        done
    else
        webfriend -D signup.fs
    fi
done
