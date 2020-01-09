var express = require('express')
var app = express()
 
// SHOW LIST OF USERS
app.get('/', function(req, res, next) {
    req.getConnection(function(error, conn) {
        conn.query('SELECT * FROM tbl_tasks ORDER BY id DESC',function(err, rows, fields) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)
                res.render('task/list', {
                    title: 'Task List', 
                    data: ''
                })
            } else {
                // render to views/user/list.ejs template file
                res.render('task/list', {
                    title: 'Task List', 
                    data: rows
                })
            }
        })
    })
})
 
// SHOW ADD USER FORM
app.get('/add', function(req, res, next){    
    // render to views/user/add.ejs
    res.render('task/add', {
        title: 'Add New Task',
        task_name: '',
        due_date:'',
    })
})
 
// ADD NEW USER POST ACTION
app.post('/add', function(req, res, next){
    let task_name = req.body.task_name;
    let due_date = req.body.due_date;
    req.assert('task_name', 'Name is required').notEmpty()
    req.assert('due_date', 'Date is required').notEmpty()

    var errors = req.validationErrors()
    
    if( !errors ) {   //No errors were found.  Passed Validation!
        var task = {
            task_name: req.sanitize('task_name').escape().trim(),
            due_date: req.sanitize('due_date').escape().trim()
        }
        req.getConnection(function(error, conn) {
            conn.query('INSERT INTO tbl_tasks SET ?', task, function(err, result) {
                //if(err) throw err
                if (err) {
                    req.flash('error', err)
                    
                    // render to views/user/add.ejs
                    res.render('task/add', {
                        title: 'Add New Task',
                        task_name: task.task_name,
                        due_date: task.due_date,
                    })
                } else {                
                    req.flash('success', 'Data added successfully!')
                    
                    // render to views/user/add.ejs
                    res.render('task/add', {
                        title: 'Add New User',
                        task_name: '',
                        due_date:'',
                    })
                }
            })
        })
    }
    else {   //Display errors to user
        var error_msg = ''
        errors.forEach(function(error) {
            error_msg += error.msg + '<br>'
        })                
        req.flash('error', error_msg)
        res.render('user/add', { 
            title: 'Add New User',
            task_name: req.body.task_name,
            due_date: req.body.due_date
        })
    }
})
 
// SHOW EDIT USER FORM
app.get('/edit/(:id)', function(req, res, next){
    req.getConnection(function(error, conn) {
        conn.query('SELECT * FROM tbl_tasks WHERE id = ' + req.params.id, function(err, rows, fields) {
            if(err) throw err
            
            // if user not found
            if (rows.length <= 0) {
                req.flash('error', 'User not found with id = ' + req.params.id)
                res.redirect('/tasks')
            }
            else { // if user found
                // render to views/user/edit.ejs template file
                let DateValue = JSON.stringify(rows[0].due_date);
                res.render('task/edit', {
                    title: 'Edit Task', 
                    //data: rows[0],
                    id: rows[0].id,
                    task_name: rows[0].task_name,
                    due_date:DateValue.slice(1,11)
                })
            }            
        })
    })
})
 
// EDIT USER POST ACTION
app.put('/edit/(:id)', function(req, res, next) {
    let task_name = req.body.task_name;
    let due_date = req.body.due_date;
    req.assert('task_name', 'Name is required').notEmpty()
    req.assert('due_date', 'Date is required').notEmpty()           //Validate name
 
    var errors = req.validationErrors()
    
    if( !errors ) {   //No errors were found.  Passed Validation!
        var task = {
            task_name: req.sanitize('task_name').escape().trim(),
            due_date: req.sanitize('due_date').escape().trim()
        }
        
        req.getConnection(function(error, conn) {
            conn.query('UPDATE tbl_tasks SET ? WHERE id = ' + req.params.id, task, function(err, result) {
                //if(err) throw err
                if (err) {
                    req.flash('error', err)
                    
                    // render to views/user/add.ejs
                    res.render('task/edit', {
                        title: 'Edit Task',
                        id: req.params.id,
                        task_name: req.body.task_name,
                        due_date:req.body.due_date

                    })
                } else {
                    req.flash('success', 'Data updated successfully!');
                    res.redirect('/tasks')
                }
            })
        })
    }
    else {   //Display errors to user
        var error_msg = ''
        errors.forEach(function(error) {
            error_msg += error.msg + '<br>'
        })
        req.flash('error', error_msg)

        res.render('task/edit', { 
            title: 'Edit Task',            
            id: req.params.id,
			name: req.body.task_name
        })
    }
})
 
// DELETE USER
app.delete('/delete/(:id)', function(req, res, next) {
    var user = { id: req.params.id }
    
    req.getConnection(function(error, conn) {
        conn.query('DELETE FROM tbl_tasks WHERE id = ' + req.params.id, user, function(err, result) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)
                // redirect to users list page
                res.redirect('/tasks')
            } else {
                req.flash('success', 'Task deleted successfully')
                // redirect to users list page
                res.redirect('/tasks')
            }
        })
    })
})
 
module.exports = app