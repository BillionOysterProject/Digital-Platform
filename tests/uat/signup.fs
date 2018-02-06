env 'URL' {
    fallback: 'http://127.0.0.1:8081'
}                  -> $url

env 'ROLE'         -> $role
env 'LEAD_TYPE'    -> $teamLeadType
env 'TEACHER_TYPE' -> $teacherType
env 'ORG' {
    fallback: 'Billion Oyster Project',
}                  -> $organization

env 'FIRST_NAME' {
    fallback: 'test',
}                  -> $firstName

env 'LAST_NAME' {
    fallback: 'user',
}                  -> $lastName

if not $role {
    fail "[FAIL] ROLE environment variable is required"
} else {
    log "[    ] ROLE is '{role}'"
}


go "{url}/authentication/signup"

# User Details
# --------------------------------------------------------------------------------------------------

field '#firstName' {
    value: $firstName,
}

field '#lastName' {
    value: $lastName,
}

# HACK: use JS to get a random string
javascript 'return Math.random().toString(36).substr(2)' -> $random

field '#email' {
    value: "test{random}@mailinator.com",
}

click "input[value='{role}']"

if $role == 'team lead pending' {
    if $teamLeadType {
        log "[    ] LEAD_TYPE is {teamLeadType}"
        click "input[value='{teamLeadType}']"

        if $teamLeadType == 'teacher' {
            if $teacherType {
                log "[    ] TEACHER_TYPE is {teacherType}"
                click "input[value='{teacherType}']"
            } else {
                fail "[FAIL] ROLE={role} LEAD_TYPE={teamLeadType} Must specify a TEACHER_TYPE"
            }
        }
    } else {
        fail "[FAIL] ROLE={role} Must specify a LEAD_TYPE"
    }
} else if $role == 'team member pending' {
    javascript 'angular.element("#teamLead").scope().vm.credentials.teamLead = "59e4d7b65dcf490fc5f39e8f";'
}

# Organization
# --------------------------------------------------------------------------------------------------
scroll_to '#organization'

# click to open the organization typeahead
javascript begin
    $('#organization').find('span').click();
end

# type in the organization name
type $organization

select '.ui-select-choices-row'

# select the autocomplete item
javascript begin
    $('#organization').find('.ui-select-choices-row span')[0].click();
end

field '#username' {
    value: "test{random}"
}

field '#password' {
    value: $random,
}

field '#retypePassword' {
    value: $random,
}

click 'input[ng-model="vm.hasAcceptedTermsOfUse"]'

click '#signup'

if select '#errors' -> $errors {
    fail "[FAIL] ROLE={role} LEAD_TYPE={teamLeadType} TEACHER_TYPE={teacherType}"
} else {
    log  "[ OK ] ROLE={role} LEAD_TYPE={teamLeadType} TEACHER_TYPE={teacherType}"
}
