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
-- Name: Notification; Type: TABLE; Schema: public; Owner: manan
--

CREATE TABLE public."Notification" (
    id integer NOT NULL,
    type text NOT NULL,
    content text NOT NULL,
    "postId" integer,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "userIdToInform" integer
);


ALTER TABLE public."Notification" OWNER TO manan;

--
-- Name: Notification_id_seq; Type: SEQUENCE; Schema: public; Owner: manan
--

CREATE SEQUENCE public."Notification_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Notification_id_seq" OWNER TO manan;

--
-- Name: Notification_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: manan
--

ALTER SEQUENCE public."Notification_id_seq" OWNED BY public."Notification".id;


--
-- Name: Post; Type: TABLE; Schema: public; Owner: manan
--

CREATE TABLE public."Post" (
    id integer NOT NULL,
    caption text NOT NULL,
    "totalComments" integer DEFAULT 0 NOT NULL,
    "totalLikes" integer DEFAULT 0 NOT NULL,
    created timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "userId" integer NOT NULL,
    "fileName" text,
    "mediaType" text NOT NULL
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
    "isAdmin" boolean DEFAULT false NOT NULL,
    bio text
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
-- Name: Notification id; Type: DEFAULT; Schema: public; Owner: manan
--

ALTER TABLE ONLY public."Notification" ALTER COLUMN id SET DEFAULT nextval('public."Notification_id_seq"'::regclass);


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
\.


--
-- Data for Name: Like; Type: TABLE DATA; Schema: public; Owner: manan
--

COPY public."Like" (id, "createdAt", "postId", "userId") FROM stdin;
\.


--
-- Data for Name: Notification; Type: TABLE DATA; Schema: public; Owner: manan
--

COPY public."Notification" (id, type, content, "postId", "createdAt", "userIdToInform") FROM stdin;
\.


--
-- Data for Name: Post; Type: TABLE DATA; Schema: public; Owner: manan
--

COPY public."Post" (id, caption, "totalComments", "totalLikes", created, "userId", "fileName", "mediaType") FROM stdin;
1	Friends on netflix!	1	2	2024-08-17 21:22:48.462	3	219420f01e050b86f65ac28a20dc1180a9133c3971418587a62a0a802abf6d17	Image
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: manan
--

COPY public."User" (id, email, password, name, "createdAt", "updatedAt", "isAdmin", bio) FROM stdin;
1	admin@gmail.com	admin	Admin	2024-08-17 21:05:21.414	2024-08-17 21:04:56.088	t	\N
2	ryan@gmail.com	$2b$10$su5Bl65GtmgyjhGPKC10E.6thlLQ.Ia7A3.ViCro.ZTZMO9goPm0u	Ryan	2024-08-17 21:09:52.413	2024-08-17 21:09:52.413	f	Hi, this is ryan here!
3	jack@gmail.com	$2b$10$U2o10yQZZHLQf9tKHOKf8es5lm1WY4sVSenuKUjUyvZBjaZYW.xXu	Jack	2024-08-17 21:10:15.84	2024-08-17 21:10:15.84	f	Jack here, whatsuppp
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: manan
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
1ecfc9b4-ae42-4a36-ae3d-2c98aea28705	251d6aec1f1a9aff4e852e409b1d49d653069b1b0f8a20134854a196d5392ca5	2024-08-17 14:00:50.779124-07	20240811024346_add_comments_likes	\N	\N	2024-08-17 14:00:50.770133-07	1
273a9d94-07f9-4b15-87dd-768230be1a8f	df16896ae103093bb5019269ed6fcf15f8c4d35985729cf134f4e93341a39989	2024-08-17 14:00:50.787168-07	20240813012710_prev_migration	\N	\N	2024-08-17 14:00:50.77998-07	1
ac75f062-3179-4398-b9fe-5aee98214210	8653293e9f65485c3878d9700d9343cb11f0c6dd7644675bb71c19040ca09a8d	2024-08-17 14:00:50.788769-07	20240814034553_add_is_admin_field	\N	\N	2024-08-17 14:00:50.787604-07	1
bf04e2b9-dd7e-441f-be7b-b9e3ab20d65b	a9e7a9746392a4e90e4c8c54d8c5f3498f1037283d463eb1dcd15f3f3a33b570	2024-08-17 14:00:51.217465-07	20240817210051_add_media_type_and_rename_file_name	\N	\N	2024-08-17 14:00:51.216057-07	1
ad80c62a-5ef2-4f1f-84af-2a10360851be	6e46e7e28682a16cb97be35b67a33e9683cf3d67571eb865581587c4f37aef3a	2024-08-17 14:06:47.515231-07	20240817210647_add_bio_to_user	\N	\N	2024-08-17 14:06:47.513406-07	1
0d360b6d-f11c-40e9-ac79-0ce8c905158d	c1e7114b11ec822407eab135270689e3fa3fa0eb04ee57ea7e681708873cfe7a	2024-08-18 00:32:50.21912-07	20240818073250_made_file_name_optional_for_thoughts	\N	\N	2024-08-18 00:32:50.217239-07	1
808c3cfb-79fd-4591-95f7-178f94020091	d4e0758754f654ec51e55c8d2d8f0865a24ba6c6246f398fa4f2b7d81a220de2	2024-08-19 00:27:54.116869-07	20240819072754_add_notifications	\N	\N	2024-08-19 00:27:54.109267-07	1
6b4c8b8c-a2c4-4c0f-b493-7f7b8256c2b5	d2886479114a8bd3253d62a9f97b8465cc44487a47afa20999a745f9649e1ae1	2024-08-19 14:04:50.780922-07	20240819210450_edit_notifications_user_id_to_inform	\N	\N	2024-08-19 14:04:50.774619-07	1
\.


--
-- Name: Comment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: manan
--

SELECT pg_catalog.setval('public."Comment_id_seq"', 28, true);


--
-- Name: Like_id_seq; Type: SEQUENCE SET; Schema: public; Owner: manan
--

SELECT pg_catalog.setval('public."Like_id_seq"', 10, true);


--
-- Name: Notification_id_seq; Type: SEQUENCE SET; Schema: public; Owner: manan
--

SELECT pg_catalog.setval('public."Notification_id_seq"', 27, true);


--
-- Name: Post_id_seq; Type: SEQUENCE SET; Schema: public; Owner: manan
--

SELECT pg_catalog.setval('public."Post_id_seq"', 13, true);


--
-- Name: User_id_seq; Type: SEQUENCE SET; Schema: public; Owner: manan
--

SELECT pg_catalog.setval('public."User_id_seq"', 22, true);


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
-- Name: Notification Notification_pkey; Type: CONSTRAINT; Schema: public; Owner: manan
--

ALTER TABLE ONLY public."Notification"
    ADD CONSTRAINT "Notification_pkey" PRIMARY KEY (id);


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
-- Name: Notification_userIdToInform_idx; Type: INDEX; Schema: public; Owner: manan
--

CREATE INDEX "Notification_userIdToInform_idx" ON public."Notification" USING btree ("userIdToInform");


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
-- Name: Notification Notification_postId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: manan
--

ALTER TABLE ONLY public."Notification"
    ADD CONSTRAINT "Notification_postId_fkey" FOREIGN KEY ("postId") REFERENCES public."Post"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Notification Notification_userIdToInform_fkey; Type: FK CONSTRAINT; Schema: public; Owner: manan
--

ALTER TABLE ONLY public."Notification"
    ADD CONSTRAINT "Notification_userIdToInform_fkey" FOREIGN KEY ("userIdToInform") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


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

