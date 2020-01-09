#######STEP 1
 
Create a database in the mysql by running the below commad in mysql terminal
  
```CREATE DATABASE IF NOT EXISTS webprog```  

Create a table by ruuning the below command  
  ```
create table tbl_tasks(id INT(11) AUTO_INCREMENT PRIMARY KEY, task_name varchar(255), due_date datetime)  
```
Also add the name of database in the config.js and also add other configuration also.

```
unzip  

Run 'npm install' inside the task-mysql folder
``` 
```
var config = {
	database: {
		host: 'localhost',
		user: 'root',
		password: 'root',
		port: 3306,
		db: 'webprog'
	},
	server:{
		host: '127.0.0.1',
		port: '3000'
	}
```

#######STEP 2

```
In the terminal run the folling command

sudo docker-compose build
sudo docker-compose up -d --remove-orphans

```

```
open in browser http://localhost:3000/
```

