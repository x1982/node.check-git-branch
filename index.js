'use strict';
var exec = require('child_process').exec;
var notifier = require('node-notifier');

var CheckGitBranch = {
    getProject: function(){
        var str = process.cwd();
        var arr = str.split('/');
        return arr[arr.length-1];
    },

    notify: function( branch ){
        var project = this.getProject();
        notifier.notify({
            title: branch + ' 分被强制切换',
            message: '项目【' + project + '】分支不在 ' + branch + ' 上'
        });
    },

    checkBranch: function(stdout, branch){
        var arr = stdout.split("\n");
        if ( arr[0].toLowerCase().indexOf( branch ) < 0) {
            this.notify(branch);
        }
    },

    launch: function( branch ){
        var cmdStr = 'git status';
        var me = this;
        exec(cmdStr, function(err, stdout, stderr){
            if (err) {
                console.log('ERROR:' + stderr);
            } else {
                me.checkBranch(stdout, branch);
            }
            setTimeout(function(){
                me.launch(branch)
            }, 1000);
        });
    }
};

module.exports = CheckGitBranch;