--
-- PostgreSQL database dump
--

-- Dumped from database version 16.0
-- Dumped by pg_dump version 16.3 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: aws_file_upload; Type: DATABASE; Schema: -; Owner: manan
--

CREATE DATABASE aws_file_upload WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = icu LOCALE = 'en_US.UTF-8' ICU_LOCALE = 'en-US';


ALTER DATABASE aws_file_upload OWNER TO manan;

\connect aws_file_upload

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: manan
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO manan;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: manan
--

COMMENT ON SCHEMA public IS '';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Comment; Type: TABLE; Schema: public; Owner: manan
--

CREATE TABLE public."Comment" (
    id integer NOT NULL,
    content text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "postId" integer NOT NULL,
    "userId" integer NOT NULL
);


ALTER TABLE public."Comment" OWNER TO manan;

--
-- Name: Comment_id_seq; Type: SEQUENCE; Schema: public; Owner: manan
--

CREATE SEQUENCE public."Comment_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Comment_id_seq" OWNER TO manan;

--
-- Name: Comment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: manan
--

ALTER SEQUENCE public."Comment_id_seq" OWNED BY public."Comment".id;


--
-- Name: Like; Type: TABLE; Schema: public; Owner: manan
--

CREATE TABLE public."Like" (
    id integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "postId" integer NOT NULL,
    "userId" integer NOT NULL
);


ALTER TABLE public."Like" OWNER TO manan;

--
-- Name: Like_id_seq; Type: SEQUENCE; Schema: public; Owner: manan
--

CREATE SEQUENCE public."Like_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Like_id_seq" OWNER TO manan;

--
-- Name: Like_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: manan
--

ALTER SEQUENCE public."Like_id_seq" OWNED BY public."Like".id;


--
-- Name: Post; Type: TABLE; Schema: public; Owner: manan
--

CREATE TABLE public."Post" (
    id integer NOT NULL,
    "imageName" text NOT NULL,
    caption text NOT NULL,
    "totalComments" integer DEFAULT 0 NOT NULL,
    "totalLikes" integer DEFAULT 0 NOT NULL,
    created timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "userId" integer NOT NULL
);


ALTER TABLE public."Post" OWNER TO manan;

--
-- Name: Post_id_seq; Type: SEQUENCE; Schema: public; Owner: manan
--

CREATE SEQUENCE public."Post_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Post_id_seq" OWNER TO manan;

--
-- Name: Post_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: manan
--

ALTER SEQUENCE public."Post_id_seq" OWNED BY public."Post".id;


--
-- Name: User; Type: TABLE; Schema: public; Owner: manan
--

CREATE TABLE public."User" (
    id integer NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    name text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "isAdmin" boolean DEFAULT false NOT NULL
);


ALTER TABLE public."User" OWNER TO manan;

--
-- Name: User_id_seq; Type: SEQUENCE; Schema: public; Owner: manan
--

CREATE SEQUENCE public."User_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."User_id_seq" OWNER TO manan;

--
-- Name: User_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: manan
--

ALTER SEQUENCE public."User_id_seq" OWNED BY public."User".id;


--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: manan
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO manan;

--
-- Name: Comment id; Type: DEFAULT; Schema: public; Owner: manan
--

ALTER TABLE ONLY public."Comment" ALTER COLUMN id SET DEFAULT nextval('public."Comment_id_seq"'::regclass);


--
-- Name: Like id; Type: DEFAULT; Schema: public; Owner: manan
--

ALTER TABLE ONLY public."Like" ALTER COLUMN id SET DEFAULT nextval('public."Like_id_seq"'::regclass);


--
-- Name: Post id; Type: DEFAULT; Schema: public; Owner: manan
--

ALTER TABLE ONLY public."Post" ALTER COLUMN id SET DEFAULT nextval('public."Post_id_seq"'::regclass);


--
-- Name: User id; Type: DEFAULT; Schema: public; Owner: manan
--

ALTER TABLE ONLY public."User" ALTER COLUMN id SET DEFAULT nextval('public."User_id_seq"'::regclass);


--
-- Data for Name: Comment; Type: TABLE DATA; Schema: public; Owner: manan
--

COPY public."Comment" (id, content, "createdAt", "postId", "userId") FROM stdin;
2	Manifest wow!	2024-08-14 01:38:08.478	6	2
3	So cool!	2024-08-14 01:38:12.858	6	2
4	Looking good!	2024-08-14 01:59:05.24	6	4
6	Nice	2024-08-15 02:11:41.686	6	5
7	Nice	2024-08-15 02:11:50.552	6	5
8	Nice	2024-08-15 02:12:14.635	6	5
9	Good picture!	2024-08-15 02:26:08.991	6	2
10	Great	2024-08-15 02:26:53.953	6	2
11	Tree nice!	2024-08-15 02:27:36.727	9	2
12	Nice	2024-08-15 02:30:36.323	9	2
13	Code is good	2024-08-15 02:30:52.017	9	2
14	Damn!	2024-08-15 05:49:39.609	6	2
15	Nice tree good job!	2024-08-16 03:16:26.799	9	2
16	Nice tree good job!	2024-08-16 03:16:28.041	9	2
17	Nice tree good job!	2024-08-16 03:19:46.451	9	2
18	HIiiii	2024-08-16 03:22:03.207	9	2
19	Good f u	2024-08-16 04:18:31.96	9	2
\.


--
-- Data for Name: Like; Type: TABLE DATA; Schema: public; Owner: manan
--

COPY public."Like" (id, "createdAt", "postId", "userId") FROM stdin;
5	2024-08-14 01:38:16.966	6	2
6	2024-08-14 01:55:29.438	6	4
7	2024-08-14 02:11:05.449	7	4
8	2024-08-14 04:08:58.951	7	5
9	2024-08-14 04:09:00.705	6	5
10	2024-08-15 02:11:33.763	9	5
11	2024-08-15 02:23:06.729	9	2
12	2024-08-15 02:24:11.647	7	2
\.


--
-- Data for Name: Post; Type: TABLE DATA; Schema: public; Owner: manan
--

COPY public."Post" (id, "imageName", caption, "totalComments", "totalLikes", created, "userId") FROM stdin;
7	663032f5030f7625d7b7a09fe6a5976139b899de3c5fb04dd898b53063a565c8	Friends	0	3	2024-08-14 02:11:02.274	4
6	47ba0a5bd09ead0e863a8d2227718b6aea4677cf1f0dbbf8f75b3efbfe5aaf1b	Manifest	10	3	2024-08-14 01:38:00.335	2
9	f3e62796e21c37f3e3b642357d7ff470c3567d6e509e88c2dc5ecf218f24fd3f	Code - Tree	11	2	2024-08-14 05:58:37.16	2
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: manan
--

COPY public."User" (id, email, password, name, "createdAt", "updatedAt", "isAdmin") FROM stdin;
4	admin@gmail.com	$2b$10$ec0IRG.E5OCGWYxhX8SDmuIAUjNHR53JS4hB1yo0p8LD7CQqDUxti	admin	2024-08-14 01:55:13.594	2024-08-14 01:55:13.594	f
2	manan@gmail.com	$2b$10$uG8B3ElXrGyvyCt2V4gAKOUVAGlXDo4JQy0p9KZ72q.Y9SX1U/DBW	Manan	2024-08-13 01:58:14.098	2024-08-14 04:02:41.504	f
5	manan78424@gmail.com	$2b$10$u7GWI9n2cCUUkHygwYlFp.MfwMnmFxl3GjYnYrV9.gVPPPtB385Xa	Manan	2024-08-14 04:01:27.435	2024-08-14 04:02:41.504	t
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: manan
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
2e3172c8-77b6-435d-ae3a-948377924d61	251d6aec1f1a9aff4e852e409b1d49d653069b1b0f8a20134854a196d5392ca5	2024-08-12 18:35:39.531612-07	20240811024346_add_comments_likes	\N	\N	2024-08-12 18:35:39.520195-07	1
4711bb02-54b4-4290-88c7-557984d52b39	df16896ae103093bb5019269ed6fcf15f8c4d35985729cf134f4e93341a39989	2024-08-12 18:35:39.536641-07	20240813012710_prev_migration	\N	\N	2024-08-12 18:35:39.531911-07	1
3211e239-3203-4586-8c7c-23b115c095f0	8653293e9f65485c3878d9700d9343cb11f0c6dd7644675bb71c19040ca09a8d	2024-08-13 20:45:53.391108-07	20240814034553_add_is_admin_field	\N	\N	2024-08-13 20:45:53.382364-07	1
\.


--
-- Name: Comment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: manan
--

SELECT pg_catalog.setval('public."Comment_id_seq"', 19, true);


--
-- Name: Like_id_seq; Type: SEQUENCE SET; Schema: public; Owner: manan
--

SELECT pg_catalog.setval('public."Like_id_seq"', 12, true);


--
-- Name: Post_id_seq; Type: SEQUENCE SET; Schema: public; Owner: manan
--

SELECT pg_catalog.setval('public."Post_id_seq"', 9, true);


--
-- Name: User_id_seq; Type: SEQUENCE SET; Schema: public; Owner: manan
--

SELECT pg_catalog.setval('public."User_id_seq"', 5, true);


--
-- Name: Comment Comment_pkey; Type: CONSTRAINT; Schema: public; Owner: manan
--

ALTER TABLE ONLY public."Comment"
    ADD CONSTRAINT "Comment_pkey" PRIMARY KEY (id);


--
-- Name: Like Like_pkey; Type: CONSTRAINT; Schema: public; Owner: manan
--

ALTER TABLE ONLY public."Like"
    ADD CONSTRAINT "Like_pkey" PRIMARY KEY (id);


--
-- Name: Post Post_pkey; Type: CONSTRAINT; Schema: public; Owner: manan
--

ALTER TABLE ONLY public."Post"
    ADD CONSTRAINT "Post_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: manan
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: manan
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: Comment_postId_idx; Type: INDEX; Schema: public; Owner: manan
--

CREATE INDEX "Comment_postId_idx" ON public."Comment" USING btree ("postId");


--
-- Name: Comment_userId_idx; Type: INDEX; Schema: public; Owner: manan
--

CREATE INDEX "Comment_userId_idx" ON public."Comment" USING btree ("userId");


--
-- Name: Like_postId_idx; Type: INDEX; Schema: public; Owner: manan
--

CREATE INDEX "Like_postId_idx" ON public."Like" USING btree ("postId");


--
-- Name: Like_userId_idx; Type: INDEX; Schema: public; Owner: manan
--

CREATE INDEX "Like_userId_idx" ON public."Like" USING btree ("userId");


--
-- Name: Post_userId_idx; Type: INDEX; Schema: public; Owner: manan
--

CREATE INDEX "Post_userId_idx" ON public."Post" USING btree ("userId");


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: manan
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: Comment Comment_postId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: manan
--

ALTER TABLE ONLY public."Comment"
    ADD CONSTRAINT "Comment_postId_fkey" FOREIGN KEY ("postId") REFERENCES public."Post"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Comment Comment_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: manan
--

ALTER TABLE ONLY public."Comment"
    ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Like Like_postId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: manan
--

ALTER TABLE ONLY public."Like"
    ADD CONSTRAINT "Like_postId_fkey" FOREIGN KEY ("postId") REFERENCES public."Post"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Like Like_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: manan
--

ALTER TABLE ONLY public."Like"
    ADD CONSTRAINT "Like_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Post Post_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: manan
--

ALTER TABLE ONLY public."Post"
    ADD CONSTRAINT "Post_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: DATABASE aws_file_upload; Type: ACL; Schema: -; Owner: manan
--

REVOKE CONNECT,TEMPORARY ON DATABASE aws_file_upload FROM PUBLIC;
GRANT TEMPORARY ON DATABASE aws_file_upload TO PUBLIC;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: manan
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

