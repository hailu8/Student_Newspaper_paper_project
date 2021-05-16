import psycopg2  # use this package to work with postgresql
import psycopg2.sql  # use this package to work with postgresql
import datetime
import numpy as np
credentials = {
    "host": "localhost",
    "port": "5432",
    "dbname": "newspaper_1",
    "user": "cmsc828d",
    "password": "apple"
}
con = psycopg2.connect(
    host=credentials["host"],
    database=credentials["dbname"],
    user=credentials["user"],
    port=credentials["port"],
    password=credentials["password"]
)
cur = con.cursor()

def get_connection(debug=False):
    try:
        con = psycopg2.connect(
            host=credentials["host"],
            database=credentials["dbname"],
            user=credentials["user"],
            port=credentials["port"])
        return (con, con.cursor())
    except psycopg2.OperationalError as _:
        return None

def get_articles_from_id(a_id_):
    ret = {}
    return ret


def get_articles_from_keyword(phrase):
    ret = {}


def get_range_query(nonce, start_date, end_date, num=20):
    data = [{"id": i,
             "title": "Title %d" % i,
             "date": "2015-%02d-%02d" % (1 + int(i/30), 1 + (i % 30)),
             "paper": "black explosion"
             } for i in range(1, num)]

    data_date = datetime.datetime.strptime(data[0]["date"], '%Y-%m-%d')
    start_date = datetime.datetime.strptime(start_date, '%Y-%m-%d')
    end_date = datetime.datetime.strptime(end_date, '%Y-%m-%d')
    year_diff = end_date.year - start_date.year

    bin_years = [[] for _ in range(year_diff+1)]
    bin_years[data_date.year - start_date.year] = list(range(1, num))
    new_data = {}
    new_data["result"] = data
    new_data["start_year"] = start_date.year
    new_data["end_year"] = end_date.year
    new_data["bin_years"] = bin_years
    return new_data


def get_data_query(nonce, id):
    data = {}
    data["title"] = "This is a title"
    data["body"] = """Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
    Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    """
    data["id"] = id
    data["paper"] = "Hello this is CMSC828D final project template"
    data["date"]="2021-05-10"
    data["keywords"]= ["Lorem", "ipsum", "dolor", "sit", "amet"]
    return data


def real_get_data_query(nonce, identity):

    query = "Select * From articles_mat Where id =" +str(identity)+";"

    cur.execute(query)
    query_data = cur.fetchall()
    data = {}
    data["id"] = query_data[0][0]
    data["title"] = query_data[0][1]
    data["body"] = query_data[0][2]
    data["date"]=str(query_data[0][3])
    data["paper"] = query_data[0][4]

    return data
    
    
 

def real_get_range_query(nonce, start_date, end_date):
    if not nonce:
        return get_range_query(nonce, start_date, end_date)
    query = "Select * From articles_mat Where year BETWEEN "+ "'"+ str(start_date)+ "'" + " and "+ "'"+ str(end_date)+ "'"+ ";"
    #nonce[1].execute(query)
    #query_data = nonce[1].fetchall()
    cur.execute(query)
    query_data = cur.fetchall()
    data = [None]*len(query_data)
    start_date = datetime.datetime.strptime(start_date,'%Y-%m-%d')
    end_date = datetime.datetime.strptime(end_date,'%Y-%m-%d')
    year_diff = end_date.year - start_date.year
    bin_years = [ [] for _ in range(year_diff+1) ]
    body_len = np.zeros(len(query_data))
    years = np.zeros(len(query_data))
    titles = [None]*len(query_data)
    id_list = np.zeros(len(query_data))
    #print(id_list)
    for i in range(0,len(query_data)):
        data[i] = {"id":query_data[i][0],
                   "title": str(query_data[i][1]),
                   "date": str(query_data[i][3]),
                   "paper": query_data[i][4],
                   "year": query_data[i][3].year,
                   "word_count": len(query_data[i][2].split())
                   }
        #year_ind = query_data[i][3].year - start_date.year
        #print("year_ind",year_ind)
        #bin_years[year_ind].append(query_data[i][0])
        #body_len[i] = (len(query_data[i][2].split()))
        #years[i] = query_data[i][3].year
        #titles[i] =str(query_data[i][1])
        #id_list[i] = int(query_data[i][0])
    #new_data={}
    #new_data["result"] = data
    #new_data["start_year"] = start_date.year
    #new_data["end_year"] = end_date.year
    #new_data["bin_years"] = bin_years
    #new_data["body_len"] = list(body_len)
    #new_data["max_word"] = np.max(body_len)
    #new_data["min_word"] = np.min(body_len)
    #new_data["year"] = list(years)
    #new_data["id"] = list(id_list)
    #new_data["title"] = titles
    return data

def real_get_paper_range_query(nonce, paper, start_date, end_date):
    if str(paper) == "all":
        query = "Select * From articles_mat Where year BETWEEN "+ "'"+ str(start_date)+ "'" + " and "+ "'"+ str(end_date)+ "'"+ ";"
    else:
        query = "Select * From articles_mat Where paper="+ "'"+ str(paper)+ "'"+" and "+  "year BETWEEN "+ "'"+ str(start_date)+ "'" + " and "+ "'"+ str(end_date)+ "'"+ ";"
    if str(paper) =="mitzpeh":
        query2 = "Select * From articles_mat Where paper="+ "'"+ "Mitzpeh"+ "'"+" and "+  "year BETWEEN "+ "'"+ str(start_date)+ "'" + " and "+ "'"+ str(end_date)+ "'"+ ";"
    cur.execute(query)
    query_data = cur.fetchall()
    day = 1
    month = 1
    if (str(paper) =="mitzpeh"):
        cur.execute(query2)
        query2_data = cur.fetchall()
        data = [None]*(len(query_data)+len(query2_data))
        #print("data length", len(data))
        for i in range(0,len(query_data)):
            #print(i)
            temp_date = datetime.date(query_data[i][3].year,month,day)
            date_diff = (query_data[i][3] - temp_date).days
            date_per = float(date_diff/365)
            data[i] = {"id":query_data[i][0],
                       "title": str(query_data[i][1]),
                       "date": str(query_data[i][3]),
                       "paper": query_data[i][4],
                       "year": query_data[i][3].year,
                       "word_count": len(query_data[i][2].split()),
                       "year_dec": float(query_data[i][3].year+ date_per)
                       }
        #print(len(query_data))
        #print((len(query2_data)+len(query_data)))
        for i in range(len(query_data),(len(query2_data)+len(query_data))):
            #print(i)
            temp_date = datetime.date(query2_data[i-len(query_data)][3].year,month,day)
            date_diff = (query2_data[i-len(query_data)][3] - temp_date).days
            date_per = float(date_diff/365)
            data[i] = {"id":query2_data[i-len(query_data)][0],
                       "title": str(query2_data[i-len(query_data)][1]),
                       "date": str(query2_data[i-len(query_data)][3]),
                       "paper": query2_data[i-len(query_data)][4],
                       "year": query2_data[i-len(query_data)][3].year,
                       "word_count": len(query2_data[i-len(query_data)][2].split()),
                       "year_dec": float(query2_data[i-len(query_data)][3].year+ date_per)
                    }
    else:
        data = [None]*(len(query_data))
        for i in range(0,len(query_data)):
            temp_date = datetime.date(query_data[i][3].year,month,day)
            date_diff = (query_data[i][3] - temp_date).days
            date_per = float(date_diff/365)
            #print(float(query_data[i][3].year+ date_per))
            data[i] = {"id":query_data[i][0],
                       "title": str(query_data[i][1]),
                       "date": str(query_data[i][3]),
                       "paper": query_data[i][4],
                       "year": query_data[i][3].year,
                       "word_count": len(query_data[i][2].split()),
                       "year_dec": float(query_data[i][3].year+ date_per)
                       }
    return data




def real_get_month_bin(nonce, start_date, end_date):
    if not nonce:
        return get_range_query(nonce, start_date, end_date)
    query = "Select * From articles_mat Where year BETWEEN "+ "'"+ str(start_date)+ "'" + " and "+ "'"+ str(end_date)+ "'"+ ";"

    cur.execute(query)
    query_data = cur.fetchall()
    data = [None]*len(query_data)

    start_date = datetime.datetime.strptime(start_date,'%Y-%m-%d')
    end_date = datetime.datetime.strptime(end_date,'%Y-%m-%d')
    year_diff = end_date.year - start_date.year

    bin_months = [[] for _ in range((year_diff+1)*12)]

    # This goes through each index of the data
    for (i, row) in enumerate(query_data):
        # Puts the data in this form
        data[i] = {"id": row[0],
                   "title": row[1],
                   "date": str(row[3]),
                   "paper": row[4]
                   }

        # Finds the year and the month
        year_ind = row[3].year - start_date.year
        month_ind = row[3].month

        # Stores that month wise in bin_months
        bin_months[(year_ind*12)+month_ind-1].append(data[i])

    new_data = {}
    new_data["result"] = data
    new_data["start_year"] = start_date.year
    new_data["end_year"] = end_date.year
    new_list = []

    for b in bin_months:
        print(b)

        thisdict = {"data": b}
        new_list.append(thisdict)
    print(new_list)
    new_data["bin_month"] = new_list
    return new_data




def real_get_keywords(nonce,keyword,paper,start_date,end_date):
    #query = "Select * From articles_mat Where id in (SELECT id FROM keywords_mat WHERE lower(keyword) LIKE "+ "'%"+str(keyword)+ "%');"
    if str(paper) == "all":
        query = "Select * From articles_mat Where (id in (SELECT id FROM keywords_mat WHERE lower(keyword) LIKE "+ "'%"+ str(keyword)+ "%')) and (year BETWEEN " + "'"+ str(start_date)+"'"+" and " +"'"+ str(end_date)+"');"
    else:
        query = "Select * From articles_mat Where (id in (SELECT id FROM keywords_mat WHERE lower(keyword) LIKE "+ "'%"+ str(keyword)+ "%')) and (year BETWEEN " + "'"+ str(start_date)+"'"+" and " +"'"+ str(end_date)+"') and (paper = " "'"+str(paper)+"');"
    if str(paper) =="mitzpeh":
        query2 = "Select * From articles_mat Where (id in (SELECT id FROM keywords_mat WHERE lower(keyword) LIKE "+ "'%"+ str(keyword)+ "%')) and (year BETWEEN " + "'"+ str(start_date)+"'"+" and " +"'"+ str(end_date)+"') and (paper = "+"'"+"Mitzpeh" +"');"

    cur.execute(query)
    query_data = cur.fetchall()
    day = 1
    month = 1
    if (str(paper) =="mitzpeh"):
        cur.execute(query2)
        query2_data = cur.fetchall()
        data = [None]*(len(query_data)+len(query2_data))
        #print("data length", len(data))
        for i in range(0,len(query_data)):
            #print(i)
            temp_date = datetime.date(query_data[i][3].year,month,day)
            date_diff = (query_data[i][3] - temp_date).days
            date_per = float(date_diff/365)
            data[i] = {"id":query_data[i][0],
                       "title": str(query_data[i][1]),
                       "date": str(query_data[i][3]),
                       "paper": query_data[i][4],
                       "year": query_data[i][3].year,
                       "word_count": len(query_data[i][2].split()),
                       "year_dec": float(query_data[i][3].year+ date_per)
                       }
        #print(len(query_data))
        #print((len(query2_data)+len(query_data)))
        for i in range(len(query_data),(len(query2_data)+len(query_data))):
            #print(i)
            temp_date = datetime.date(query2_data[i-len(query_data)][3].year,month,day)
            date_diff = (query2_data[i-len(query_data)][3] - temp_date).days
            date_per = float(date_diff/365)
            data[i] = {"id":query2_data[i-len(query_data)][0],
                       "title": str(query2_data[i-len(query_data)][1]),
                       "date": str(query2_data[i-len(query_data)][3]),
                       "paper": query2_data[i-len(query_data)][4],
                       "year": query2_data[i-len(query_data)][3].year,
                       "word_count": len(query2_data[i-len(query_data)][2].split()),
                       "year_dec": float(query2_data[i-len(query_data)][3].year+ date_per)
                    }
    else:
        data = [None]*(len(query_data))
        for i in range(0,len(query_data)):
            temp_date = datetime.date(query_data[i][3].year,month,day)
            date_diff = (query_data[i][3] - temp_date).days
            date_per = float(date_diff/365)
            #print(float(query_data[i][3].year+ date_per))
            data[i] = {"id":query_data[i][0],
                       "title": str(query_data[i][1]),
                       "date": str(query_data[i][3]),
                       "paper": query_data[i][4],
                       "year": query_data[i][3].year,
                       "word_count": len(query_data[i][2].split()),
                       "year_dec": float(query_data[i][3].year+ date_per)
                       }
    return data