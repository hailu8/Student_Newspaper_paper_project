# Student_Newspaper_paper_project
Clone or download the zip from githhub
1. Make sure you have an empty database created to load the .sql file.  In our case, we are using a database called "newspaper_1"
2. Go to the working directory and open the Postgres server using the terminal. 
3. Download https://drive.google.com/file/d/1uqkJlH4q4y4pcq3BNTbwhTf5Rol_1AwK/view?usp=sharing
        To start the Postgres environment type and load the .sql use
			psql -U cmsc828d -d newspaper_1 -1 -f  C:\path_to_where_this_file_is_stored/newspaper.sql
        It will prompt the password for the newspaper_1; it is "apple". If you want to change it go to db_access.py and change the value.
After this step, you have successfully loaded the table into the database. (disclaimer, it might take a 30 mins!)
3. Write an SQL script to create the materialized view.

4. Run server.py, and open http://127.0.0.1:8000/ with your browser.

