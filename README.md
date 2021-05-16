# Student_Newspaper_paper_project
Clone or download the zip from githhub
1. Make sure you have an empty database created to load the .sql file.  In my case, I am using a database called "a2database."
2. Go to the working directory and open the Postgres server using the terminal. 
        To start the Postgres environment type and load the .sql use
			psql -U cmsc828d -d a2database -1 -f  C:\path_to_where_my_submission_is_stored/Olympic.sql
                        psql -U cmsc828d -d newspaper_1 -1 -f  C:\Users\kiyaa\OneDrive\Desktop\Final_Project\news_paper_dump.sql
        It will prompt the password for the a2database; it is "1234"
After this step, you have successfully loaded the table into the database.
3. Run server.py, and open http://127.0.0.1:8000/ with your browser
