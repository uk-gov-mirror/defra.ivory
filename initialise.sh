#!/bin/bash

# Helper that clones a remote Git repository, and sets up a tracking branch for
# master.  If a develop branch exists, this is also setup and checked-out.
# Otherwise, master is checked-out.
function clone_repo {
    git_host=`echo $1 | awk -F/ '{print $3}'`
    repo_dir=${1##*/}
    repo_dir=${repo_dir%%.git}

    if [ ! -d $repo_dir ]; then
        echo "-- Getting ${repo_dir} from ${git_host} --"
        git clone --branch master $1
        cd $repo_dir
        dev_branch_exists=`git ls-remote --heads $1 develop | wc -l`
        if [ $dev_branch_exists != 0 ]; then
            git checkout --track origin/develop
        fi
        cd ..
        printf "\n\n"
    fi

    if [ -d $repo_dir ]; then
        echo "-- Installing ${repo_dir} --"
        cd $repo_dir
        npm install
        cd ..
        printf "\n\n"
    fi
}

# Get all the repos required for Waste Exemptions.
clone_repo https://github.com/DEFRA/ivory-api.git
clone_repo https://github.com/DEFRA/ivory-front-office.git