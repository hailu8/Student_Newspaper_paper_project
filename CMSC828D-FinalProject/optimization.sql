	 create index on articles(title,paper,year,id);

	 create index on keywords(keyword, id);

	 CREATE MATERIALIZED VIEW articles_mat AS SELECT * FROM articles;

	 CREATE MATERIALIZED VIEW keywords_mat AS SELECT * FROM keywords;

	 REFRESH MATERIALIZED VIEW articles_mat;

	 REFRESH MATERIALIZED VIEW keywords_mat;
