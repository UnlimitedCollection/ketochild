--
-- PostgreSQL database dump
--

\restrict bf87c9mH7QzXKGujFaDeGZaSHoZITyI09QQWplgZImcJLSzew5ZfSPn4VkbOE7t

-- Dumped from database version 16.10
-- Dumped by pg_dump version 16.10

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: doctors; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.doctors (
    id integer NOT NULL,
    username character varying(100) NOT NULL,
    password text NOT NULL,
    name character varying(200) NOT NULL,
    email character varying(255) NOT NULL,
    designation character varying(200),
    profile_photo text,
    mobile character varying(20),
    role character varying(20) DEFAULT 'admin'::character varying NOT NULL,
    must_change_password boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: doctors_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.doctors_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: doctors_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.doctors_id_seq OWNED BY public.doctors.id;


--
-- Name: foods; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.foods (
    id integer NOT NULL,
    name character varying(200) NOT NULL,
    category character varying(100) NOT NULL,
    carbs real DEFAULT 0 NOT NULL,
    fat real DEFAULT 0 NOT NULL,
    protein real DEFAULT 0 NOT NULL,
    calories real DEFAULT 0 NOT NULL,
    image_url text DEFAULT ''::text,
    description text DEFAULT ''::text,
    indicator character varying(50) DEFAULT 'vegi'::character varying,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: foods_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.foods_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: foods_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.foods_id_seq OWNED BY public.foods.id;


--
-- Name: ketone_readings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ketone_readings (
    id integer NOT NULL,
    kid_id integer NOT NULL,
    value real NOT NULL,
    unit character varying(20) DEFAULT 'mmol/L'::character varying NOT NULL,
    reading_type character varying(20) DEFAULT 'blood'::character varying NOT NULL,
    date date NOT NULL,
    notes text,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: ketone_readings_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.ketone_readings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: ketone_readings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.ketone_readings_id_seq OWNED BY public.ketone_readings.id;


--
-- Name: kid_food_approvals; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.kid_food_approvals (
    id integer NOT NULL,
    kid_id integer NOT NULL,
    food_id integer NOT NULL,
    status character varying(20) NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    CONSTRAINT kid_food_approvals_status_chk CHECK (((status)::text = ANY ((ARRAY['approved'::character varying, 'avoid'::character varying])::text[])))
);


--
-- Name: kid_food_approvals_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.kid_food_approvals_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: kid_food_approvals_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.kid_food_approvals_id_seq OWNED BY public.kid_food_approvals.id;


--
-- Name: kids; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.kids (
    id integer NOT NULL,
    name character varying(200) NOT NULL,
    kid_code character varying(50) NOT NULL,
    date_of_birth date NOT NULL,
    gender character varying(10) NOT NULL,
    parent_name character varying(200) NOT NULL,
    parent_contact character varying(100) NOT NULL,
    phase integer DEFAULT 1 NOT NULL,
    doctor_id integer,
    current_meal_plan_id integer,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: kids_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.kids_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: kids_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.kids_id_seq OWNED BY public.kids.id;


--
-- Name: library_meal_plan_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.library_meal_plan_items (
    id integer NOT NULL,
    plan_id integer NOT NULL,
    meal_type character varying(50) NOT NULL,
    food_name character varying(200) NOT NULL,
    portion_grams real DEFAULT 100 NOT NULL,
    unit character varying(50) DEFAULT 'g'::character varying NOT NULL,
    calories real DEFAULT 0,
    carbs real DEFAULT 0,
    fat real DEFAULT 0,
    protein real DEFAULT 0,
    notes text DEFAULT ''::text,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: library_meal_plan_items_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.library_meal_plan_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: library_meal_plan_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.library_meal_plan_items_id_seq OWNED BY public.library_meal_plan_items.id;


--
-- Name: library_meal_plans; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.library_meal_plans (
    id integer NOT NULL,
    doctor_id integer,
    name character varying(200) NOT NULL,
    description text DEFAULT ''::text,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: library_meal_plans_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.library_meal_plans_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: library_meal_plans_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.library_meal_plans_id_seq OWNED BY public.library_meal_plans.id;


--
-- Name: meal_days; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.meal_days (
    id integer NOT NULL,
    kid_id integer NOT NULL,
    date date NOT NULL,
    total_meals integer DEFAULT 5 NOT NULL,
    completed_meals integer DEFAULT 0 NOT NULL,
    missed_meals integer DEFAULT 0 NOT NULL,
    is_filled boolean DEFAULT false NOT NULL,
    total_calories real DEFAULT 0,
    total_carbs real DEFAULT 0,
    total_fat real DEFAULT 0,
    total_protein real DEFAULT 0,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: meal_days_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.meal_days_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: meal_days_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.meal_days_id_seq OWNED BY public.meal_days.id;


--
-- Name: meal_entries; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.meal_entries (
    id integer NOT NULL,
    kid_id integer NOT NULL,
    date date NOT NULL,
    meal_type character varying(50) NOT NULL,
    food_name character varying(200) NOT NULL,
    quantity real DEFAULT 1 NOT NULL,
    unit character varying(50) DEFAULT 'g'::character varying NOT NULL,
    calories real DEFAULT 0,
    carbs real DEFAULT 0,
    fat real DEFAULT 0,
    protein real DEFAULT 0,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: meal_entries_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.meal_entries_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: meal_entries_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.meal_entries_id_seq OWNED BY public.meal_entries.id;


--
-- Name: meal_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.meal_logs (
    id integer NOT NULL,
    kid_id integer NOT NULL,
    date date NOT NULL,
    meal_type character varying(50) NOT NULL,
    is_completed boolean DEFAULT false NOT NULL,
    calories real DEFAULT 0,
    carbs real DEFAULT 0,
    fat real DEFAULT 0,
    protein real DEFAULT 0,
    notes text,
    image_url text,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: meal_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.meal_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: meal_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.meal_logs_id_seq OWNED BY public.meal_logs.id;


--
-- Name: meal_plan_assignment_history; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.meal_plan_assignment_history (
    id integer NOT NULL,
    kid_id integer NOT NULL,
    plan_id integer,
    plan_name character varying(200),
    doctor_id integer,
    doctor_name character varying(200) NOT NULL,
    action character varying(20) NOT NULL,
    assigned_at timestamp without time zone DEFAULT now() NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: meal_plan_assignment_history_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.meal_plan_assignment_history_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: meal_plan_assignment_history_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.meal_plan_assignment_history_id_seq OWNED BY public.meal_plan_assignment_history.id;


--
-- Name: meal_plan_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.meal_plan_items (
    id integer NOT NULL,
    plan_id integer NOT NULL,
    meal_type character varying(50) NOT NULL,
    food_id integer NOT NULL,
    food_name character varying(200) NOT NULL,
    portion_grams real DEFAULT 100 NOT NULL,
    calories real DEFAULT 0,
    carbs real DEFAULT 0,
    fat real DEFAULT 0,
    protein real DEFAULT 0,
    notes text DEFAULT ''::text,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: meal_plan_items_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.meal_plan_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: meal_plan_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.meal_plan_items_id_seq OWNED BY public.meal_plan_items.id;


--
-- Name: meal_plans; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.meal_plans (
    id integer NOT NULL,
    kid_id integer NOT NULL,
    name character varying(200) NOT NULL,
    description text DEFAULT ''::text,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: meal_plans_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.meal_plans_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: meal_plans_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.meal_plans_id_seq OWNED BY public.meal_plans.id;


--
-- Name: meal_type_recipes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.meal_type_recipes (
    meal_type_id integer NOT NULL,
    recipe_id integer NOT NULL
);


--
-- Name: meal_types; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.meal_types (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: meal_types_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.meal_types_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: meal_types_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.meal_types_id_seq OWNED BY public.meal_types.id;


--
-- Name: medical_settings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.medical_settings (
    id integer NOT NULL,
    kid_id integer NOT NULL,
    phase integer DEFAULT 1 NOT NULL,
    keto_ratio real DEFAULT 3 NOT NULL,
    daily_calories real DEFAULT 1200 NOT NULL,
    daily_carbs real DEFAULT 20 NOT NULL,
    daily_fat real DEFAULT 100 NOT NULL,
    daily_protein real DEFAULT 40 NOT NULL,
    show_all_foods boolean DEFAULT true NOT NULL,
    show_all_recipes boolean DEFAULT true NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: medical_settings_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.medical_settings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: medical_settings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.medical_settings_id_seq OWNED BY public.medical_settings.id;


--
-- Name: notes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.notes (
    id integer NOT NULL,
    kid_id integer NOT NULL,
    doctor_id integer,
    doctor_name character varying(200) NOT NULL,
    content text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: notes_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.notes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: notes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.notes_id_seq OWNED BY public.notes.id;


--
-- Name: parent_tokens; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.parent_tokens (
    id integer NOT NULL,
    kid_id integer NOT NULL,
    token character varying(64) NOT NULL,
    status character varying(20) DEFAULT 'active'::character varying NOT NULL,
    expires_at timestamp without time zone NOT NULL,
    used_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    revoked_at timestamp without time zone
);


--
-- Name: parent_tokens_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.parent_tokens_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: parent_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.parent_tokens_id_seq OWNED BY public.parent_tokens.id;


--
-- Name: recipe_ingredients; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.recipe_ingredients (
    id integer NOT NULL,
    recipe_id integer NOT NULL,
    food_name character varying(200) NOT NULL,
    portion_grams real DEFAULT 100 NOT NULL,
    unit character varying(50) DEFAULT 'g'::character varying NOT NULL,
    carbs real DEFAULT 0 NOT NULL,
    fat real DEFAULT 0 NOT NULL,
    protein real DEFAULT 0 NOT NULL,
    calories real DEFAULT 0 NOT NULL
);


--
-- Name: recipe_ingredients_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.recipe_ingredients_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: recipe_ingredients_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.recipe_ingredients_id_seq OWNED BY public.recipe_ingredients.id;


--
-- Name: recipes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.recipes (
    id integer NOT NULL,
    doctor_id integer NOT NULL,
    name character varying(200) NOT NULL,
    description text DEFAULT ''::text,
    category character varying(100) DEFAULT 'General'::character varying NOT NULL,
    image_url text DEFAULT ''::text,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: recipes_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.recipes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: recipes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.recipes_id_seq OWNED BY public.recipes.id;


--
-- Name: weight_records; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.weight_records (
    id integer NOT NULL,
    kid_id integer NOT NULL,
    weight real NOT NULL,
    date date NOT NULL,
    note text,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: weight_records_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.weight_records_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: weight_records_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.weight_records_id_seq OWNED BY public.weight_records.id;


--
-- Name: doctors id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.doctors ALTER COLUMN id SET DEFAULT nextval('public.doctors_id_seq'::regclass);


--
-- Name: foods id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.foods ALTER COLUMN id SET DEFAULT nextval('public.foods_id_seq'::regclass);


--
-- Name: ketone_readings id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ketone_readings ALTER COLUMN id SET DEFAULT nextval('public.ketone_readings_id_seq'::regclass);


--
-- Name: kid_food_approvals id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.kid_food_approvals ALTER COLUMN id SET DEFAULT nextval('public.kid_food_approvals_id_seq'::regclass);


--
-- Name: kids id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.kids ALTER COLUMN id SET DEFAULT nextval('public.kids_id_seq'::regclass);


--
-- Name: library_meal_plan_items id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.library_meal_plan_items ALTER COLUMN id SET DEFAULT nextval('public.library_meal_plan_items_id_seq'::regclass);


--
-- Name: library_meal_plans id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.library_meal_plans ALTER COLUMN id SET DEFAULT nextval('public.library_meal_plans_id_seq'::regclass);


--
-- Name: meal_days id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.meal_days ALTER COLUMN id SET DEFAULT nextval('public.meal_days_id_seq'::regclass);


--
-- Name: meal_entries id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.meal_entries ALTER COLUMN id SET DEFAULT nextval('public.meal_entries_id_seq'::regclass);


--
-- Name: meal_logs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.meal_logs ALTER COLUMN id SET DEFAULT nextval('public.meal_logs_id_seq'::regclass);


--
-- Name: meal_plan_assignment_history id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.meal_plan_assignment_history ALTER COLUMN id SET DEFAULT nextval('public.meal_plan_assignment_history_id_seq'::regclass);


--
-- Name: meal_plan_items id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.meal_plan_items ALTER COLUMN id SET DEFAULT nextval('public.meal_plan_items_id_seq'::regclass);


--
-- Name: meal_plans id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.meal_plans ALTER COLUMN id SET DEFAULT nextval('public.meal_plans_id_seq'::regclass);


--
-- Name: meal_types id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.meal_types ALTER COLUMN id SET DEFAULT nextval('public.meal_types_id_seq'::regclass);


--
-- Name: medical_settings id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medical_settings ALTER COLUMN id SET DEFAULT nextval('public.medical_settings_id_seq'::regclass);


--
-- Name: notes id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notes ALTER COLUMN id SET DEFAULT nextval('public.notes_id_seq'::regclass);


--
-- Name: parent_tokens id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.parent_tokens ALTER COLUMN id SET DEFAULT nextval('public.parent_tokens_id_seq'::regclass);


--
-- Name: recipe_ingredients id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.recipe_ingredients ALTER COLUMN id SET DEFAULT nextval('public.recipe_ingredients_id_seq'::regclass);


--
-- Name: recipes id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.recipes ALTER COLUMN id SET DEFAULT nextval('public.recipes_id_seq'::regclass);


--
-- Name: weight_records id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.weight_records ALTER COLUMN id SET DEFAULT nextval('public.weight_records_id_seq'::regclass);


--
-- Data for Name: doctors; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.doctors (id, username, password, name, email, designation, profile_photo, mobile, role, must_change_password, created_at) FROM stdin;
1	admin	$2b$12$Fcz.oAreD7KfljMkhk2NL.upztGgv2tpGzeN5aO2L12.so5WylLui	Dr. Sarah Johnson	sarah.johnson@ketokidcare.com	Pediatric Neurology	\N	\N	admin	f	2026-03-31 05:29:48.7286
2	admin1	$2b$12$8jnmOnxnw1u/03cBGvf.IORhfZ7.UTpgH1IDr.z5XmF4HqxPVxtMW	Dr. Alex Moderator	alex.moderator@ketokidcare.com	Pediatric Neurology	\N	\N	moderator	f	2026-03-31 05:29:49.084135
\.


--
-- Data for Name: foods; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.foods (id, name, category, carbs, fat, protein, calories, image_url, description, indicator, is_active, created_at, updated_at) FROM stdin;
3	Spinach	Carb	1.4	0.4	2.9	23		Leafy green rich in iron and magnesium	vegi	t	2026-03-31 05:29:49.094028	2026-03-31 05:29:49.094028
4	Cauliflower	Carb	5	0.3	1.9	25		Versatile low-carb vegetable	vegi	t	2026-03-31 05:29:49.096719	2026-03-31 05:29:49.096719
5	Zucchini	Carb	3.1	0.3	1.2	17		Light squash suitable for keto diets	vegi	t	2026-03-31 05:29:49.099447	2026-03-31 05:29:49.099447
6	Cucumber	Carb	3.6	0.1	0.7	15		Refreshing, very low carb	vegi	t	2026-03-31 05:29:49.102603	2026-03-31 05:29:49.102603
7	Cabbage	Carb	5.8	0.1	1.3	25		Affordable keto-friendly vegetable	vegi	t	2026-03-31 05:29:49.106305	2026-03-31 05:29:49.106305
8	Bell Pepper	Carb	4.6	0.3	0.9	20		Green peppers lower in carbs	vegi	t	2026-03-31 05:29:49.108506	2026-03-31 05:29:49.108506
9	Kale	Carb	4.4	0.9	4.3	49		Nutrient-dense leafy green	vegi	t	2026-03-31 05:29:49.111302	2026-03-31 05:29:49.111302
10	Asparagus	Carb	3.9	0.1	2.2	20		Low-carb spring vegetable	vegi	t	2026-03-31 05:29:49.115022	2026-03-31 05:29:49.115022
11	Celery	Carb	3	0.2	0.7	16		Very low calorie, keto staple	vegi	t	2026-03-31 05:29:49.117925	2026-03-31 05:29:49.117925
12	Mushrooms	Carb	3.3	0.3	3.1	22		Savory and low carb	vegi	t	2026-03-31 05:29:49.121402	2026-03-31 05:29:49.121402
13	Lettuce	Carb	2.4	0.3	1.2	17		Classic salad base	vegi	t	2026-03-31 05:29:49.125199	2026-03-31 05:29:49.125199
14	Green Beans	Carb	7	0.1	1.8	31		Kid-friendly vegetable	vegi	t	2026-03-31 05:29:49.127648	2026-03-31 05:29:49.127648
15	Eggplant	Carb	5.9	0.2	1	25		Low-carb Mediterranean vegetable	vegi	t	2026-03-31 05:29:49.130417	2026-03-31 05:29:49.130417
16	Olive Oil	Calories	0	100	0	884		Primary fat source for keto cooking	vegi	t	2026-03-31 05:29:49.132715	2026-03-31 05:29:49.132715
17	Coconut Oil	Calories	0	100	0	862		High MCT fat ideal for ketogenic diets	vegi	t	2026-03-31 05:29:49.135892	2026-03-31 05:29:49.135892
18	Butter	Calories	0.1	81	0.9	717		Saturated fat for keto cooking	vegi	t	2026-03-31 05:29:49.138274	2026-03-31 05:29:49.138274
19	Avocado Oil	Calories	0	100	0	884		Neutral-flavored keto cooking oil	vegi	t	2026-03-31 05:29:49.140598	2026-03-31 05:29:49.140598
20	MCT Oil	Calories	0	100	0	862		Medium-chain triglycerides for rapid ketone production	vegi	t	2026-03-31 05:29:49.142927	2026-03-31 05:29:49.142927
21	Heavy Cream	Fat	3.4	35	2.1	340		High-fat dairy, great for ketogenic ratios	vegi	t	2026-03-31 05:29:49.145788	2026-03-31 05:29:49.145788
22	Cream Cheese	Fat	4.1	33	5.9	342		Rich keto-friendly spread	vegi	t	2026-03-31 05:29:49.148484	2026-03-31 05:29:49.148484
23	Cheddar Cheese	Protein	1.3	33	25	403		Popular hard cheese for keto snacks	vegi	t	2026-03-31 05:29:49.151343	2026-03-31 05:29:49.151343
24	Mozzarella	Protein	2.2	22	22	280		Mild cheese suitable for children	vegi	t	2026-03-31 05:29:49.153563	2026-03-31 05:29:49.153563
25	Parmesan	Protein	3.2	29	38	431		Strong flavored, high protein cheese	vegi	t	2026-03-31 05:29:49.155952	2026-03-31 05:29:49.155952
26	Greek Yogurt	Protein	4.1	5	9	97		Higher protein dairy option	vegi	t	2026-03-31 05:29:49.158647	2026-03-31 05:29:49.158647
27	Chicken Breast	Protein	0	3.6	31	165		Lean protein source for keto	non-vegi	t	2026-03-31 05:29:49.160753	2026-03-31 05:29:49.160753
28	Chicken Thigh	Protein	0	9	26	209		Juicier cut with higher fat content	non-vegi	t	2026-03-31 05:29:49.163109	2026-03-31 05:29:49.163109
29	Ground Beef	Protein	0	20	26	287		Versatile keto protein base	non-vegi	t	2026-03-31 05:29:49.165617	2026-03-31 05:29:49.165617
30	Beef Ribeye	Protein	0	37	27	450		High-fat cut for higher keto ratios	non-vegi	t	2026-03-31 05:29:49.168231	2026-03-31 05:29:49.168231
31	Lamb Chops	Protein	0	24	25	315		Rich lamb meat with good fat content	non-vegi	t	2026-03-31 05:29:49.170639	2026-03-31 05:29:49.170639
32	Bacon	Protein	0.7	42	37	541		High-fat cured meat for keto	non-vegi	t	2026-03-31 05:29:49.173073	2026-03-31 05:29:49.173073
33	Pork Belly	Fat	0	53	9	518		Very high fat, ideal for 4:1 keto ratio	non-vegi	t	2026-03-31 05:29:49.1757	2026-03-31 05:29:49.1757
34	Turkey Breast	Protein	0	1	29	135		Very lean poultry protein	non-vegi	t	2026-03-31 05:29:49.178359	2026-03-31 05:29:49.178359
35	Duck	Protein	0	28	19	337		High-fat poultry ideal for keto ratios	non-vegi	t	2026-03-31 05:29:49.180827	2026-03-31 05:29:49.180827
36	Salmon	Protein	0	13	25	208		Rich omega-3, excellent for keto	non-vegi	t	2026-03-31 05:29:49.183573	2026-03-31 05:29:49.183573
37	Tuna	Protein	0	5	25	132		Convenient protein source	non-vegi	t	2026-03-31 05:29:49.186235	2026-03-31 05:29:49.186235
38	Sardines	Protein	0	11	25	208		High omega-3 small fish	non-vegi	t	2026-03-31 05:29:49.188813	2026-03-31 05:29:49.188813
39	Mackerel	Protein	0	13	19	205		Fatty fish high in omega-3s	non-vegi	t	2026-03-31 05:29:49.191452	2026-03-31 05:29:49.191452
40	Shrimp	Protein	0.9	1.4	24	106		Low fat seafood, high protein	non-vegi	t	2026-03-31 05:29:49.193804	2026-03-31 05:29:49.193804
41	Cod	Protein	0	0.7	18	82		Lean white fish, mild flavor	non-vegi	t	2026-03-31 05:29:49.196586	2026-03-31 05:29:49.196586
42	Whole Eggs	Protein	0.6	10	13	155		Complete protein, essential keto food	non-vegi	t	2026-03-31 05:29:49.199133	2026-03-31 05:29:49.199133
43	Egg Yolks	Fat	3.6	27	16	322		Fat and nutrient dense egg component	non-vegi	t	2026-03-31 05:29:49.201748	2026-03-31 05:29:49.201748
44	Macadamia Nuts	Fat	5	76	8	718		Highest fat nut, ideal for keto	vegi	t	2026-03-31 05:29:49.204507	2026-03-31 05:29:49.204507
45	Walnuts	Fat	7	65	15	654		Rich in omega-3 fatty acids	vegi	t	2026-03-31 05:29:49.207484	2026-03-31 05:29:49.207484
46	Almonds	Fat	10	50	21	579		Popular keto snack nut	vegi	t	2026-03-31 05:29:49.210264	2026-03-31 05:29:49.210264
47	Pecans	Fat	4	72	9	691		Very low net carb nut	vegi	t	2026-03-31 05:29:49.21231	2026-03-31 05:29:49.21231
48	Chia Seeds	Fat	6	31	17	486		High fiber, omega-3 seeds	vegi	t	2026-03-31 05:29:49.214702	2026-03-31 05:29:49.214702
49	Flaxseeds	Fat	3	42	18	534		Omega-3 rich seeds for keto baking	vegi	t	2026-03-31 05:29:49.220762	2026-03-31 05:29:49.220762
50	Pumpkin Seeds	Protein	3	49	30	559		High protein, magnesium-rich	vegi	t	2026-03-31 05:29:49.223328	2026-03-31 05:29:49.223328
51	Hemp Seeds	Protein	3	49	32	553		Complete protein with great fat ratio	vegi	t	2026-03-31 05:29:49.225848	2026-03-31 05:29:49.225848
52	Almond Butter	Fat	7	50	21	614		Keto-friendly nut butter	vegi	t	2026-03-31 05:29:49.228979	2026-03-31 05:29:49.228979
53	Blueberries	Carb	12	0.3	0.7	57		Lower sugar berries for occasional keto use	fruit	t	2026-03-31 05:29:49.231729	2026-03-31 05:29:49.231729
54	Raspberries	Carb	5.4	0.7	1.2	52		Low net carb berries	fruit	t	2026-03-31 05:29:49.233544	2026-03-31 05:29:49.233544
55	Strawberries	Carb	7.7	0.3	0.7	32		Moderate carb berries in small portions	fruit	t	2026-03-31 05:29:49.235824	2026-03-31 05:29:49.235824
56	Blackberries	Carb	5.1	0.5	1.4	43		Low net carb berry option	fruit	t	2026-03-31 05:29:49.23865	2026-03-31 05:29:49.23865
57	Olives	Fat	3.8	11	0.8	115		High fat fruit ideal for keto	fruit	t	2026-03-31 05:29:49.241658	2026-03-31 05:29:49.241658
58	Coconut Meat	Fat	6	35	3.3	354		High-fat tropical fruit for keto	fruit	t	2026-03-31 05:29:49.24412	2026-03-31 05:29:49.24412
59	Almond Flour	Carb	10	54	24	576		Low-carb flour alternative for keto baking	vegi	t	2026-03-31 05:29:49.246823	2026-03-31 05:29:49.246823
60	Coconut Flour	Carb	18	9	6	400		High-fiber keto baking flour, very absorbent	vegi	t	2026-03-31 05:29:49.248952	2026-03-31 05:29:49.248952
61	Psyllium Husk	Carb	2	0	0	20		Keto-friendly binder and fiber supplement	vegi	t	2026-03-31 05:29:49.251986	2026-03-31 05:29:49.251986
62	Flaxseed Meal	Carb	2	9	5	140		Ground flaxseeds for keto bread and baking	vegi	t	2026-03-31 05:29:49.254482	2026-03-31 05:29:49.254482
2	Broccoli	Carb	4	0.4	2.6	34		Low-carb cruciferous vegetable	vegi	f	2026-03-31 05:29:49.0917	2026-04-02 04:15:33.106
1	Avocado	Fat	2	15	2	160		High in healthy fats, great for keto	vegi	f	2026-03-31 05:29:49.089339	2026-04-02 04:15:43.214
\.


--
-- Data for Name: ketone_readings; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.ketone_readings (id, kid_id, value, unit, reading_type, date, notes, created_at) FROM stdin;
833	105	1.8	mmol/L	blood	2026-03-31	Home monitoring reading	2026-03-31 06:08:29.245767
834	105	1.7	mmol/L	blood	2026-03-27	\N	2026-03-31 06:08:29.248079
835	105	2.3	mmol/L	blood	2026-03-23	\N	2026-03-31 06:08:29.250982
836	105	2.3	mmol/L	blood	2026-03-19	\N	2026-03-31 06:08:29.253
837	105	2.3	mmol/L	blood	2026-03-15	\N	2026-03-31 06:08:29.255376
838	105	2.3	mmol/L	blood	2026-03-11	\N	2026-03-31 06:08:29.257434
839	105	1.8	mmol/L	blood	2026-03-07	\N	2026-03-31 06:08:29.260524
840	105	1.6	mmol/L	blood	2026-03-03	\N	2026-03-31 06:08:29.262935
841	106	0.9	mmol/L	blood	2026-03-31	Home monitoring reading	2026-03-31 06:08:29.389785
842	106	1.4	mmol/L	blood	2026-03-27	\N	2026-03-31 06:08:29.392315
843	106	0.9	mmol/L	blood	2026-03-23	\N	2026-03-31 06:08:29.394966
844	106	1.1	mmol/L	blood	2026-03-19	\N	2026-03-31 06:08:29.397357
845	106	0.8	mmol/L	blood	2026-03-15	\N	2026-03-31 06:08:29.39956
846	106	1.2	mmol/L	blood	2026-03-11	\N	2026-03-31 06:08:29.402219
847	106	1.1	mmol/L	blood	2026-03-07	\N	2026-03-31 06:08:29.404659
848	106	1.2	mmol/L	blood	2026-03-03	\N	2026-03-31 06:08:29.407054
849	107	2.8	mmol/L	blood	2026-03-31	Home monitoring reading	2026-03-31 06:08:29.530502
850	107	2.9	mmol/L	blood	2026-03-27	\N	2026-03-31 06:08:29.532787
851	107	3.2	mmol/L	blood	2026-03-23	\N	2026-03-31 06:08:29.535044
852	107	3.4	mmol/L	blood	2026-03-19	\N	2026-03-31 06:08:29.537086
853	107	3.2	mmol/L	blood	2026-03-15	\N	2026-03-31 06:08:29.539436
854	107	3.2	mmol/L	blood	2026-03-11	\N	2026-03-31 06:08:29.541602
855	107	3.2	mmol/L	blood	2026-03-07	\N	2026-03-31 06:08:29.544331
856	107	3	mmol/L	blood	2026-03-03	\N	2026-03-31 06:08:29.547083
857	108	3.4	mmol/L	blood	2026-03-31	Home monitoring reading	2026-03-31 06:08:29.675189
858	108	3.3	mmol/L	blood	2026-03-27	\N	2026-03-31 06:08:29.677365
859	108	3	mmol/L	blood	2026-03-23	\N	2026-03-31 06:08:29.679873
860	108	3.1	mmol/L	blood	2026-03-19	\N	2026-03-31 06:08:29.682318
861	108	3.3	mmol/L	blood	2026-03-15	\N	2026-03-31 06:08:29.684314
862	108	2.9	mmol/L	blood	2026-03-11	\N	2026-03-31 06:08:29.686505
863	108	3.2	mmol/L	blood	2026-03-07	\N	2026-03-31 06:08:29.688696
864	108	3.4	mmol/L	blood	2026-03-03	\N	2026-03-31 06:08:29.691182
865	109	2.2	mmol/L	blood	2026-03-31	Home monitoring reading	2026-03-31 06:08:29.916354
866	109	2.1	mmol/L	blood	2026-03-27	\N	2026-03-31 06:08:29.918292
867	109	2.3	mmol/L	blood	2026-03-23	\N	2026-03-31 06:08:29.920621
868	109	1.7	mmol/L	blood	2026-03-19	\N	2026-03-31 06:08:29.922876
869	109	2.3	mmol/L	blood	2026-03-15	\N	2026-03-31 06:08:29.925116
870	109	2	mmol/L	blood	2026-03-11	\N	2026-03-31 06:08:29.92747
871	109	1.9	mmol/L	blood	2026-03-07	\N	2026-03-31 06:08:29.929679
872	109	2.3	mmol/L	blood	2026-03-03	\N	2026-03-31 06:08:29.932479
873	110	1.4	mmol/L	blood	2026-03-31	Home monitoring reading	2026-03-31 06:08:30.065034
874	110	1.5	mmol/L	blood	2026-03-27	\N	2026-03-31 06:08:30.067649
875	110	0.8	mmol/L	blood	2026-03-23	\N	2026-03-31 06:08:30.069477
876	110	1.4	mmol/L	blood	2026-03-19	\N	2026-03-31 06:08:30.07184
877	110	1.3	mmol/L	blood	2026-03-15	\N	2026-03-31 06:08:30.073953
878	110	1.2	mmol/L	blood	2026-03-11	\N	2026-03-31 06:08:30.076274
879	110	1.3	mmol/L	blood	2026-03-07	\N	2026-03-31 06:08:30.078492
880	110	1	mmol/L	blood	2026-03-03	\N	2026-03-31 06:08:30.080735
881	111	1.6	mmol/L	blood	2026-03-31	Home monitoring reading	2026-03-31 06:08:30.201244
882	111	2	mmol/L	blood	2026-03-27	\N	2026-03-31 06:08:30.20318
883	111	2.2	mmol/L	blood	2026-03-23	\N	2026-03-31 06:08:30.205497
884	111	2	mmol/L	blood	2026-03-19	\N	2026-03-31 06:08:30.207948
885	111	2.1	mmol/L	blood	2026-03-15	\N	2026-03-31 06:08:30.21012
886	111	1.9	mmol/L	blood	2026-03-11	\N	2026-03-31 06:08:30.212342
887	111	1.8	mmol/L	blood	2026-03-07	\N	2026-03-31 06:08:30.21423
888	111	1.7	mmol/L	blood	2026-03-03	\N	2026-03-31 06:08:30.216422
889	112	3.3	mmol/L	blood	2026-03-31	Home monitoring reading	2026-03-31 06:08:30.337077
890	112	3.2	mmol/L	blood	2026-03-27	\N	2026-03-31 06:08:30.339272
891	112	3.3	mmol/L	blood	2026-03-23	\N	2026-03-31 06:08:30.341019
892	112	3.4	mmol/L	blood	2026-03-19	\N	2026-03-31 06:08:30.343504
893	112	3.5	mmol/L	blood	2026-03-15	\N	2026-03-31 06:08:30.345716
894	112	3.1	mmol/L	blood	2026-03-11	\N	2026-03-31 06:08:30.347928
895	112	3.1	mmol/L	blood	2026-03-07	\N	2026-03-31 06:08:30.35018
896	112	3.2	mmol/L	blood	2026-03-03	\N	2026-03-31 06:08:30.352683
897	113	0.8	mmol/L	blood	2026-03-31	Home monitoring reading	2026-03-31 06:08:30.473992
898	113	1.2	mmol/L	blood	2026-03-27	\N	2026-03-31 06:08:30.475982
899	113	1.5	mmol/L	blood	2026-03-23	\N	2026-03-31 06:08:30.478216
900	113	1.1	mmol/L	blood	2026-03-19	\N	2026-03-31 06:08:30.480514
901	113	1.1	mmol/L	blood	2026-03-15	\N	2026-03-31 06:08:30.483216
902	113	1.5	mmol/L	blood	2026-03-11	\N	2026-03-31 06:08:30.484937
903	113	1.5	mmol/L	blood	2026-03-07	\N	2026-03-31 06:08:30.487157
904	113	1.2	mmol/L	blood	2026-03-03	\N	2026-03-31 06:08:30.489227
905	114	2.9	mmol/L	blood	2026-03-31	Home monitoring reading	2026-03-31 06:08:30.609219
906	114	3.5	mmol/L	blood	2026-03-27	\N	2026-03-31 06:08:30.611209
907	114	3.2	mmol/L	blood	2026-03-23	\N	2026-03-31 06:08:30.612976
908	114	3	mmol/L	blood	2026-03-19	\N	2026-03-31 06:08:30.615353
909	114	3.3	mmol/L	blood	2026-03-15	\N	2026-03-31 06:08:30.617685
910	114	3.1	mmol/L	blood	2026-03-11	\N	2026-03-31 06:08:30.619993
911	114	3.6	mmol/L	blood	2026-03-07	\N	2026-03-31 06:08:30.622051
912	114	3.5	mmol/L	blood	2026-03-03	\N	2026-03-31 06:08:30.624479
913	115	0.8	mmol/L	blood	2026-03-31	Home monitoring reading	2026-03-31 06:08:30.745214
914	115	0.8	mmol/L	blood	2026-03-27	\N	2026-03-31 06:08:30.74729
915	115	1.5	mmol/L	blood	2026-03-23	\N	2026-03-31 06:08:30.749665
916	115	1.4	mmol/L	blood	2026-03-19	\N	2026-03-31 06:08:30.751746
917	115	1.2	mmol/L	blood	2026-03-15	\N	2026-03-31 06:08:30.753932
918	115	1.4	mmol/L	blood	2026-03-11	\N	2026-03-31 06:08:30.756317
919	115	0.9	mmol/L	blood	2026-03-07	\N	2026-03-31 06:08:30.758514
920	115	1.3	mmol/L	blood	2026-03-03	\N	2026-03-31 06:08:30.760288
921	116	1.8	mmol/L	blood	2026-03-31	Home monitoring reading	2026-03-31 06:08:30.887225
922	116	2.4	mmol/L	blood	2026-03-27	\N	2026-03-31 06:08:30.890024
923	116	2.2	mmol/L	blood	2026-03-23	\N	2026-03-31 06:08:30.892097
924	116	2.3	mmol/L	blood	2026-03-19	\N	2026-03-31 06:08:30.894075
925	116	1.8	mmol/L	blood	2026-03-15	\N	2026-03-31 06:08:30.895791
926	116	1.6	mmol/L	blood	2026-03-11	\N	2026-03-31 06:08:30.89813
927	116	1.7	mmol/L	blood	2026-03-07	\N	2026-03-31 06:08:30.90039
928	116	1.7	mmol/L	blood	2026-03-03	\N	2026-03-31 06:08:30.902927
929	117	3.3	mmol/L	blood	2026-03-31	Home monitoring reading	2026-03-31 06:08:31.091718
930	117	3	mmol/L	blood	2026-03-27	\N	2026-03-31 06:08:31.094144
931	117	3.4	mmol/L	blood	2026-03-23	\N	2026-03-31 06:08:31.096697
932	117	3.4	mmol/L	blood	2026-03-19	\N	2026-03-31 06:08:31.099215
933	117	2.8	mmol/L	blood	2026-03-15	\N	2026-03-31 06:08:31.101228
934	117	3.1	mmol/L	blood	2026-03-11	\N	2026-03-31 06:08:31.103895
935	117	2.9	mmol/L	blood	2026-03-07	\N	2026-03-31 06:08:31.106596
936	117	3.4	mmol/L	blood	2026-03-03	\N	2026-03-31 06:08:31.10977
937	118	2.9	mmol/L	blood	2026-03-31	Home monitoring reading	2026-03-31 06:08:31.241208
938	118	2.9	mmol/L	blood	2026-03-27	\N	2026-03-31 06:08:31.243203
939	118	3	mmol/L	blood	2026-03-23	\N	2026-03-31 06:08:31.245636
940	118	3.5	mmol/L	blood	2026-03-19	\N	2026-03-31 06:08:31.247434
941	118	3.6	mmol/L	blood	2026-03-15	\N	2026-03-31 06:08:31.249914
942	118	3.1	mmol/L	blood	2026-03-11	\N	2026-03-31 06:08:31.251905
943	118	3.3	mmol/L	blood	2026-03-07	\N	2026-03-31 06:08:31.254292
944	118	3.3	mmol/L	blood	2026-03-03	\N	2026-03-31 06:08:31.256157
945	119	2	mmol/L	blood	2026-03-31	Home monitoring reading	2026-03-31 06:08:31.384044
946	119	1.9	mmol/L	blood	2026-03-27	\N	2026-03-31 06:08:31.385916
947	119	2.4	mmol/L	blood	2026-03-23	\N	2026-03-31 06:08:31.388265
948	119	1.6	mmol/L	blood	2026-03-19	\N	2026-03-31 06:08:31.390143
949	119	2.1	mmol/L	blood	2026-03-15	\N	2026-03-31 06:08:31.392514
950	119	2.3	mmol/L	blood	2026-03-11	\N	2026-03-31 06:08:31.394791
951	119	1.8	mmol/L	blood	2026-03-07	\N	2026-03-31 06:08:31.39731
952	119	1.6	mmol/L	blood	2026-03-03	\N	2026-03-31 06:08:31.399349
953	120	1	mmol/L	blood	2026-03-31	Home monitoring reading	2026-03-31 06:08:31.524342
954	120	1.2	mmol/L	blood	2026-03-27	\N	2026-03-31 06:08:31.526983
955	120	1.4	mmol/L	blood	2026-03-23	\N	2026-03-31 06:08:31.529352
956	120	1.2	mmol/L	blood	2026-03-19	\N	2026-03-31 06:08:31.531744
957	120	1.3	mmol/L	blood	2026-03-15	\N	2026-03-31 06:08:31.534462
958	120	1	mmol/L	blood	2026-03-11	\N	2026-03-31 06:08:31.536976
959	120	1.4	mmol/L	blood	2026-03-07	\N	2026-03-31 06:08:31.538991
960	120	0.9	mmol/L	blood	2026-03-03	\N	2026-03-31 06:08:31.541452
961	121	3.5	mmol/L	blood	2026-03-31	Home monitoring reading	2026-03-31 06:08:31.681358
962	121	3.1	mmol/L	blood	2026-03-27	\N	2026-03-31 06:08:31.683684
963	121	3.1	mmol/L	blood	2026-03-23	\N	2026-03-31 06:08:31.686078
964	121	3.5	mmol/L	blood	2026-03-19	\N	2026-03-31 06:08:31.688459
965	121	3.6	mmol/L	blood	2026-03-15	\N	2026-03-31 06:08:31.690303
966	121	3.1	mmol/L	blood	2026-03-11	\N	2026-03-31 06:08:31.692912
967	121	3.2	mmol/L	blood	2026-03-07	\N	2026-03-31 06:08:31.69484
968	121	3.3	mmol/L	blood	2026-03-03	\N	2026-03-31 06:08:31.697275
969	122	3.1	mmol/L	blood	2026-03-31	Home monitoring reading	2026-03-31 06:08:31.819303
970	122	3.3	mmol/L	blood	2026-03-27	\N	2026-03-31 06:08:31.821157
971	122	3.2	mmol/L	blood	2026-03-23	\N	2026-03-31 06:08:31.823804
972	122	3.5	mmol/L	blood	2026-03-19	\N	2026-03-31 06:08:31.825919
973	122	3.2	mmol/L	blood	2026-03-15	\N	2026-03-31 06:08:31.827912
974	122	3.2	mmol/L	blood	2026-03-11	\N	2026-03-31 06:08:31.82972
975	122	3.4	mmol/L	blood	2026-03-07	\N	2026-03-31 06:08:31.832166
976	122	3	mmol/L	blood	2026-03-03	\N	2026-03-31 06:08:31.834371
977	123	2.2	mmol/L	blood	2026-03-31	Home monitoring reading	2026-03-31 06:08:31.956334
978	123	1.9	mmol/L	blood	2026-03-27	\N	2026-03-31 06:08:31.958846
979	123	1.9	mmol/L	blood	2026-03-23	\N	2026-03-31 06:08:31.96142
980	123	1.9	mmol/L	blood	2026-03-19	\N	2026-03-31 06:08:31.963903
981	123	2	mmol/L	blood	2026-03-15	\N	2026-03-31 06:08:31.966279
982	123	2.2	mmol/L	blood	2026-03-11	\N	2026-03-31 06:08:31.968258
983	123	1.7	mmol/L	blood	2026-03-07	\N	2026-03-31 06:08:31.970143
984	123	2.2	mmol/L	blood	2026-03-03	\N	2026-03-31 06:08:31.972172
985	124	1.4	mmol/L	blood	2026-03-31	Home monitoring reading	2026-03-31 06:08:32.095439
986	124	0.9	mmol/L	blood	2026-03-27	\N	2026-03-31 06:08:32.098308
987	124	1.3	mmol/L	blood	2026-03-23	\N	2026-03-31 06:08:32.100517
988	124	1.1	mmol/L	blood	2026-03-19	\N	2026-03-31 06:08:32.103225
989	124	1.6	mmol/L	blood	2026-03-15	\N	2026-03-31 06:08:32.105818
990	124	1.3	mmol/L	blood	2026-03-11	\N	2026-03-31 06:08:32.108024
991	124	1	mmol/L	blood	2026-03-07	\N	2026-03-31 06:08:32.110541
992	124	1	mmol/L	blood	2026-03-03	\N	2026-03-31 06:08:32.112392
993	125	3.4	mmol/L	blood	2026-03-31	Home monitoring reading	2026-03-31 06:08:32.235756
994	125	3.3	mmol/L	blood	2026-03-27	\N	2026-03-31 06:08:32.238155
995	125	3.4	mmol/L	blood	2026-03-23	\N	2026-03-31 06:08:32.24005
996	125	3.5	mmol/L	blood	2026-03-19	\N	2026-03-31 06:08:32.242223
997	125	3.5	mmol/L	blood	2026-03-15	\N	2026-03-31 06:08:32.244576
998	125	2.9	mmol/L	blood	2026-03-11	\N	2026-03-31 06:08:32.247306
999	125	3	mmol/L	blood	2026-03-07	\N	2026-03-31 06:08:32.250226
1000	125	3	mmol/L	blood	2026-03-03	\N	2026-03-31 06:08:32.25259
1001	126	3	mmol/L	blood	2026-03-31	Home monitoring reading	2026-03-31 06:08:32.38247
1002	126	3.3	mmol/L	blood	2026-03-27	\N	2026-03-31 06:08:32.384981
1003	126	2.9	mmol/L	blood	2026-03-23	\N	2026-03-31 06:08:32.387401
1004	126	2.9	mmol/L	blood	2026-03-19	\N	2026-03-31 06:08:32.389681
1005	126	3.4	mmol/L	blood	2026-03-15	\N	2026-03-31 06:08:32.391933
1006	126	3.1	mmol/L	blood	2026-03-11	\N	2026-03-31 06:08:32.393932
1007	126	3.2	mmol/L	blood	2026-03-07	\N	2026-03-31 06:08:32.396181
1008	126	3.2	mmol/L	blood	2026-03-03	\N	2026-03-31 06:08:32.398356
1009	127	1.4	mmol/L	blood	2026-03-31	Home monitoring reading	2026-03-31 06:08:32.526614
1010	127	1.2	mmol/L	blood	2026-03-27	\N	2026-03-31 06:08:32.529324
1011	127	1.2	mmol/L	blood	2026-03-23	\N	2026-03-31 06:08:32.53193
1012	127	0.9	mmol/L	blood	2026-03-19	\N	2026-03-31 06:08:32.5342
1013	127	1.2	mmol/L	blood	2026-03-15	\N	2026-03-31 06:08:32.536268
1014	127	1.4	mmol/L	blood	2026-03-11	\N	2026-03-31 06:08:32.538631
1015	127	1.5	mmol/L	blood	2026-03-07	\N	2026-03-31 06:08:32.541741
1016	127	1.1	mmol/L	blood	2026-03-03	\N	2026-03-31 06:08:32.544437
1017	128	2	mmol/L	blood	2026-03-31	Home monitoring reading	2026-03-31 06:08:32.680931
1018	128	1.8	mmol/L	blood	2026-03-27	\N	2026-03-31 06:08:32.683269
1019	128	2	mmol/L	blood	2026-03-23	\N	2026-03-31 06:08:32.685327
1020	128	1.8	mmol/L	blood	2026-03-19	\N	2026-03-31 06:08:32.688939
1021	128	2.1	mmol/L	blood	2026-03-15	\N	2026-03-31 06:08:32.691314
1022	128	1.7	mmol/L	blood	2026-03-11	\N	2026-03-31 06:08:32.69447
1023	128	2.1	mmol/L	blood	2026-03-07	\N	2026-03-31 06:08:32.697665
1024	128	1.7	mmol/L	blood	2026-03-03	\N	2026-03-31 06:08:32.700371
1025	129	3	mmol/L	blood	2026-03-31	Home monitoring reading	2026-03-31 06:08:32.828555
1026	129	3.2	mmol/L	blood	2026-03-27	\N	2026-03-31 06:08:32.831195
1027	129	3.5	mmol/L	blood	2026-03-23	\N	2026-03-31 06:08:32.834034
1028	129	3.2	mmol/L	blood	2026-03-19	\N	2026-03-31 06:08:32.836358
1029	129	2.9	mmol/L	blood	2026-03-15	\N	2026-03-31 06:08:32.838739
1030	129	3.1	mmol/L	blood	2026-03-11	\N	2026-03-31 06:08:32.840957
1031	129	3.2	mmol/L	blood	2026-03-07	\N	2026-03-31 06:08:32.843502
1032	129	3.3	mmol/L	blood	2026-03-03	\N	2026-03-31 06:08:32.845876
1033	130	1.1	mmol/L	blood	2026-03-31	Home monitoring reading	2026-03-31 06:08:32.976737
1034	130	1	mmol/L	blood	2026-03-27	\N	2026-03-31 06:08:32.978861
1035	130	1.1	mmol/L	blood	2026-03-23	\N	2026-03-31 06:08:32.98081
1036	130	1	mmol/L	blood	2026-03-19	\N	2026-03-31 06:08:32.982719
1037	130	1	mmol/L	blood	2026-03-15	\N	2026-03-31 06:08:32.985119
1038	130	1.5	mmol/L	blood	2026-03-11	\N	2026-03-31 06:08:32.987362
1039	130	1.3	mmol/L	blood	2026-03-07	\N	2026-03-31 06:08:32.989706
1040	130	1.4	mmol/L	blood	2026-03-03	\N	2026-03-31 06:08:32.992121
1041	131	1.8	mmol/L	blood	2026-03-31	Home monitoring reading	2026-03-31 06:08:33.117801
1042	131	2.3	mmol/L	blood	2026-03-27	\N	2026-03-31 06:08:33.120274
1043	131	1.9	mmol/L	blood	2026-03-23	\N	2026-03-31 06:08:33.122936
1044	131	1.7	mmol/L	blood	2026-03-19	\N	2026-03-31 06:08:33.125122
1045	131	2.3	mmol/L	blood	2026-03-15	\N	2026-03-31 06:08:33.127482
1046	131	2	mmol/L	blood	2026-03-11	\N	2026-03-31 06:08:33.130228
1047	131	2.1	mmol/L	blood	2026-03-07	\N	2026-03-31 06:08:33.1323
1048	131	2	mmol/L	blood	2026-03-03	\N	2026-03-31 06:08:33.134948
1049	132	3.1	mmol/L	blood	2026-03-31	Home monitoring reading	2026-03-31 06:08:33.258623
1050	132	3.6	mmol/L	blood	2026-03-27	\N	2026-03-31 06:08:33.260507
1051	132	2.9	mmol/L	blood	2026-03-23	\N	2026-03-31 06:08:33.263023
1052	132	3.2	mmol/L	blood	2026-03-19	\N	2026-03-31 06:08:33.264858
1053	132	3	mmol/L	blood	2026-03-15	\N	2026-03-31 06:08:33.266801
1054	132	3.1	mmol/L	blood	2026-03-11	\N	2026-03-31 06:08:33.269056
1055	132	3.1	mmol/L	blood	2026-03-07	\N	2026-03-31 06:08:33.272056
1056	132	2.9	mmol/L	blood	2026-03-03	\N	2026-03-31 06:08:33.27437
1057	133	1.5	mmol/L	blood	2026-03-31	Home monitoring reading	2026-03-31 06:08:33.396534
1058	133	1.6	mmol/L	blood	2026-03-27	\N	2026-03-31 06:08:33.398751
1059	133	0.8	mmol/L	blood	2026-03-23	\N	2026-03-31 06:08:33.400757
1060	133	1.3	mmol/L	blood	2026-03-19	\N	2026-03-31 06:08:33.402806
1061	133	1.3	mmol/L	blood	2026-03-15	\N	2026-03-31 06:08:33.404953
1062	133	1.4	mmol/L	blood	2026-03-11	\N	2026-03-31 06:08:33.406965
1063	133	1.4	mmol/L	blood	2026-03-07	\N	2026-03-31 06:08:33.408937
1064	133	1	mmol/L	blood	2026-03-03	\N	2026-03-31 06:08:33.411192
1065	134	3.4	mmol/L	blood	2026-03-31	Home monitoring reading	2026-03-31 06:08:33.533484
1066	134	3.4	mmol/L	blood	2026-03-27	\N	2026-03-31 06:08:33.535726
1067	134	3.2	mmol/L	blood	2026-03-23	\N	2026-03-31 06:08:33.538914
1068	134	3.4	mmol/L	blood	2026-03-19	\N	2026-03-31 06:08:33.541632
1069	134	3	mmol/L	blood	2026-03-15	\N	2026-03-31 06:08:33.544155
1070	134	3.2	mmol/L	blood	2026-03-11	\N	2026-03-31 06:08:33.546011
1071	134	3.2	mmol/L	blood	2026-03-07	\N	2026-03-31 06:08:33.548271
1072	134	3.2	mmol/L	blood	2026-03-03	\N	2026-03-31 06:08:33.551155
1073	135	0.9	mmol/L	blood	2026-03-31	Home monitoring reading	2026-03-31 06:08:33.676741
1074	135	1.5	mmol/L	blood	2026-03-27	\N	2026-03-31 06:08:33.678921
1075	135	1.3	mmol/L	blood	2026-03-23	\N	2026-03-31 06:08:33.681559
1076	135	1.3	mmol/L	blood	2026-03-19	\N	2026-03-31 06:08:33.683505
1077	135	1.3	mmol/L	blood	2026-03-15	\N	2026-03-31 06:08:33.685516
1078	135	0.8	mmol/L	blood	2026-03-11	\N	2026-03-31 06:08:33.687906
1079	135	1.4	mmol/L	blood	2026-03-07	\N	2026-03-31 06:08:33.690446
1080	135	1.4	mmol/L	blood	2026-03-03	\N	2026-03-31 06:08:33.692899
1081	136	1.5	mmol/L	blood	2026-03-31	Home monitoring reading	2026-03-31 06:08:33.816134
1082	136	1.2	mmol/L	blood	2026-03-27	\N	2026-03-31 06:08:33.818011
1083	136	1.2	mmol/L	blood	2026-03-23	\N	2026-03-31 06:08:33.82038
1084	136	1.3	mmol/L	blood	2026-03-19	\N	2026-03-31 06:08:33.822703
1085	136	1.3	mmol/L	blood	2026-03-15	\N	2026-03-31 06:08:33.824706
1086	136	1.1	mmol/L	blood	2026-03-11	\N	2026-03-31 06:08:33.826902
1087	136	1.4	mmol/L	blood	2026-03-07	\N	2026-03-31 06:08:33.829294
1088	136	1	mmol/L	blood	2026-03-03	\N	2026-03-31 06:08:33.831315
1089	137	1.9	mmol/L	blood	2026-03-31	Home monitoring reading	2026-03-31 06:08:33.955788
1090	137	1.7	mmol/L	blood	2026-03-27	\N	2026-03-31 06:08:33.958182
1091	137	2.1	mmol/L	blood	2026-03-23	\N	2026-03-31 06:08:33.960792
1092	137	1.7	mmol/L	blood	2026-03-19	\N	2026-03-31 06:08:33.963357
1093	137	2.3	mmol/L	blood	2026-03-15	\N	2026-03-31 06:08:33.965792
1094	137	2	mmol/L	blood	2026-03-11	\N	2026-03-31 06:08:33.967868
1095	137	1.6	mmol/L	blood	2026-03-07	\N	2026-03-31 06:08:33.969935
1096	137	2	mmol/L	blood	2026-03-03	\N	2026-03-31 06:08:33.972814
1097	138	3.3	mmol/L	blood	2026-03-31	Home monitoring reading	2026-03-31 06:08:34.100347
1098	138	3.3	mmol/L	blood	2026-03-27	\N	2026-03-31 06:08:34.102892
1099	138	3.6	mmol/L	blood	2026-03-23	\N	2026-03-31 06:08:34.105289
1100	138	3.2	mmol/L	blood	2026-03-19	\N	2026-03-31 06:08:34.107569
1101	138	2.9	mmol/L	blood	2026-03-15	\N	2026-03-31 06:08:34.109868
1102	138	3.4	mmol/L	blood	2026-03-11	\N	2026-03-31 06:08:34.112798
1103	138	2.8	mmol/L	blood	2026-03-07	\N	2026-03-31 06:08:34.115402
1104	138	3.1	mmol/L	blood	2026-03-03	\N	2026-03-31 06:08:34.117466
1105	139	1.6	mmol/L	blood	2026-03-31	Home monitoring reading	2026-03-31 06:08:34.256701
1106	139	1.9	mmol/L	blood	2026-03-27	\N	2026-03-31 06:08:34.258875
1107	139	1.7	mmol/L	blood	2026-03-23	\N	2026-03-31 06:08:34.261413
1108	139	2	mmol/L	blood	2026-03-19	\N	2026-03-31 06:08:34.263811
1109	139	2.1	mmol/L	blood	2026-03-15	\N	2026-03-31 06:08:34.266058
1110	139	1.7	mmol/L	blood	2026-03-11	\N	2026-03-31 06:08:34.268095
1111	139	1.7	mmol/L	blood	2026-03-07	\N	2026-03-31 06:08:34.270108
1112	139	2.1	mmol/L	blood	2026-03-03	\N	2026-03-31 06:08:34.272193
1113	140	3.6	mmol/L	blood	2026-03-31	Home monitoring reading	2026-03-31 06:08:34.404642
1114	140	3.3	mmol/L	blood	2026-03-27	\N	2026-03-31 06:08:34.40701
1115	140	3.4	mmol/L	blood	2026-03-23	\N	2026-03-31 06:08:34.409211
1116	140	2.9	mmol/L	blood	2026-03-19	\N	2026-03-31 06:08:34.411486
1117	140	3.5	mmol/L	blood	2026-03-15	\N	2026-03-31 06:08:34.4143
1118	140	2.8	mmol/L	blood	2026-03-11	\N	2026-03-31 06:08:34.416244
1119	140	2.8	mmol/L	blood	2026-03-07	\N	2026-03-31 06:08:34.418629
1120	140	2.9	mmol/L	blood	2026-03-03	\N	2026-03-31 06:08:34.421194
1121	141	1	mmol/L	blood	2026-03-31	Home monitoring reading	2026-03-31 06:08:34.547027
1122	141	1.5	mmol/L	blood	2026-03-27	\N	2026-03-31 06:08:34.548777
1123	141	1.4	mmol/L	blood	2026-03-23	\N	2026-03-31 06:08:34.551281
1124	141	1.5	mmol/L	blood	2026-03-19	\N	2026-03-31 06:08:34.55321
1125	141	1.3	mmol/L	blood	2026-03-15	\N	2026-03-31 06:08:34.555431
1126	141	1	mmol/L	blood	2026-03-11	\N	2026-03-31 06:08:34.557981
1127	141	1.3	mmol/L	blood	2026-03-07	\N	2026-03-31 06:08:34.560229
1128	141	1.5	mmol/L	blood	2026-03-03	\N	2026-03-31 06:08:34.562146
1129	142	3.3	mmol/L	blood	2026-03-31	Home monitoring reading	2026-03-31 06:08:34.692069
1130	142	3.2	mmol/L	blood	2026-03-27	\N	2026-03-31 06:08:34.694038
1131	142	3.1	mmol/L	blood	2026-03-23	\N	2026-03-31 06:08:34.696301
1132	142	3	mmol/L	blood	2026-03-19	\N	2026-03-31 06:08:34.698524
1133	142	3.3	mmol/L	blood	2026-03-15	\N	2026-03-31 06:08:34.700452
1134	142	3.1	mmol/L	blood	2026-03-11	\N	2026-03-31 06:08:34.702711
1135	142	3.2	mmol/L	blood	2026-03-07	\N	2026-03-31 06:08:34.70589
1136	142	3.5	mmol/L	blood	2026-03-03	\N	2026-03-31 06:08:34.708173
1137	143	1.6	mmol/L	blood	2026-03-31	Home monitoring reading	2026-03-31 06:08:34.830812
1138	143	1	mmol/L	blood	2026-03-27	\N	2026-03-31 06:08:34.832778
1139	143	0.9	mmol/L	blood	2026-03-23	\N	2026-03-31 06:08:34.835521
1140	143	1.4	mmol/L	blood	2026-03-19	\N	2026-03-31 06:08:34.839083
1141	143	1.6	mmol/L	blood	2026-03-15	\N	2026-03-31 06:08:34.841995
1142	143	1.2	mmol/L	blood	2026-03-11	\N	2026-03-31 06:08:34.845089
1143	143	1.5	mmol/L	blood	2026-03-07	\N	2026-03-31 06:08:34.847286
1144	143	1	mmol/L	blood	2026-03-03	\N	2026-03-31 06:08:34.849602
1145	144	2.1	mmol/L	blood	2026-03-31	Home monitoring reading	2026-03-31 06:08:34.975115
1146	144	1.8	mmol/L	blood	2026-03-27	\N	2026-03-31 06:08:34.977536
1147	144	2.4	mmol/L	blood	2026-03-23	\N	2026-03-31 06:08:34.979568
1148	144	2	mmol/L	blood	2026-03-19	\N	2026-03-31 06:08:34.981884
1149	144	1.8	mmol/L	blood	2026-03-15	\N	2026-03-31 06:08:34.984236
1150	144	2.3	mmol/L	blood	2026-03-11	\N	2026-03-31 06:08:34.98657
1151	144	1.8	mmol/L	blood	2026-03-07	\N	2026-03-31 06:08:34.988879
1152	144	2.4	mmol/L	blood	2026-03-03	\N	2026-03-31 06:08:34.990815
1153	145	3.2	mmol/L	blood	2026-03-31	Home monitoring reading	2026-03-31 06:08:35.157871
1154	145	3.4	mmol/L	blood	2026-03-27	\N	2026-03-31 06:08:35.160341
1155	145	3.2	mmol/L	blood	2026-03-23	\N	2026-03-31 06:08:35.163348
1156	145	3.3	mmol/L	blood	2026-03-19	\N	2026-03-31 06:08:35.165474
1157	145	3.5	mmol/L	blood	2026-03-15	\N	2026-03-31 06:08:35.167976
1158	145	3.5	mmol/L	blood	2026-03-11	\N	2026-03-31 06:08:35.170269
1159	145	3.5	mmol/L	blood	2026-03-07	\N	2026-03-31 06:08:35.172789
1160	145	3.4	mmol/L	blood	2026-03-03	\N	2026-03-31 06:08:35.174784
1161	146	3	mmol/L	blood	2026-03-31	Home monitoring reading	2026-03-31 06:08:35.30325
1162	146	3.4	mmol/L	blood	2026-03-27	\N	2026-03-31 06:08:35.305616
1163	146	2.8	mmol/L	blood	2026-03-23	\N	2026-03-31 06:08:35.308313
1164	146	3.2	mmol/L	blood	2026-03-19	\N	2026-03-31 06:08:35.310371
1165	146	3.3	mmol/L	blood	2026-03-15	\N	2026-03-31 06:08:35.312528
1166	146	3	mmol/L	blood	2026-03-11	\N	2026-03-31 06:08:35.314757
1167	146	3.5	mmol/L	blood	2026-03-07	\N	2026-03-31 06:08:35.317247
1168	146	3.6	mmol/L	blood	2026-03-03	\N	2026-03-31 06:08:35.320486
1169	147	2.4	mmol/L	blood	2026-03-31	Home monitoring reading	2026-03-31 06:08:35.443561
1170	147	1.8	mmol/L	blood	2026-03-27	\N	2026-03-31 06:08:35.445868
1171	147	2	mmol/L	blood	2026-03-23	\N	2026-03-31 06:08:35.448169
1172	147	2.3	mmol/L	blood	2026-03-19	\N	2026-03-31 06:08:35.449965
1173	147	2.3	mmol/L	blood	2026-03-15	\N	2026-03-31 06:08:35.452334
1174	147	2.1	mmol/L	blood	2026-03-11	\N	2026-03-31 06:08:35.454513
1175	147	2.1	mmol/L	blood	2026-03-07	\N	2026-03-31 06:08:35.456453
1176	147	1.9	mmol/L	blood	2026-03-03	\N	2026-03-31 06:08:35.45869
1177	148	1.1	mmol/L	blood	2026-03-31	Home monitoring reading	2026-03-31 06:08:35.587232
1178	148	0.8	mmol/L	blood	2026-03-27	\N	2026-03-31 06:08:35.589759
1179	148	1	mmol/L	blood	2026-03-23	\N	2026-03-31 06:08:35.591899
1180	148	1.3	mmol/L	blood	2026-03-19	\N	2026-03-31 06:08:35.594374
1181	148	1.5	mmol/L	blood	2026-03-15	\N	2026-03-31 06:08:35.596724
1182	148	1	mmol/L	blood	2026-03-11	\N	2026-03-31 06:08:35.599808
1183	148	0.9	mmol/L	blood	2026-03-07	\N	2026-03-31 06:08:35.601939
1184	148	1.2	mmol/L	blood	2026-03-03	\N	2026-03-31 06:08:35.604352
1185	149	1.5	mmol/L	blood	2026-03-31	Home monitoring reading	2026-03-31 06:08:35.741001
1186	149	0.9	mmol/L	blood	2026-03-27	\N	2026-03-31 06:08:35.743291
1187	149	1.2	mmol/L	blood	2026-03-23	\N	2026-03-31 06:08:35.745696
1188	149	0.9	mmol/L	blood	2026-03-19	\N	2026-03-31 06:08:35.747714
1189	149	1.3	mmol/L	blood	2026-03-15	\N	2026-03-31 06:08:35.750452
1190	149	1.4	mmol/L	blood	2026-03-11	\N	2026-03-31 06:08:35.752915
1191	149	0.9	mmol/L	blood	2026-03-07	\N	2026-03-31 06:08:35.755115
1192	149	1.3	mmol/L	blood	2026-03-03	\N	2026-03-31 06:08:35.75711
1193	150	3.2	mmol/L	blood	2026-03-31	Home monitoring reading	2026-03-31 06:08:35.87826
1194	150	3.3	mmol/L	blood	2026-03-27	\N	2026-03-31 06:08:35.880592
1195	150	3.4	mmol/L	blood	2026-03-23	\N	2026-03-31 06:08:35.882839
1196	150	3.4	mmol/L	blood	2026-03-19	\N	2026-03-31 06:08:35.884797
1197	150	3.2	mmol/L	blood	2026-03-15	\N	2026-03-31 06:08:35.886738
1198	150	3.5	mmol/L	blood	2026-03-11	\N	2026-03-31 06:08:35.889076
1199	150	3.2	mmol/L	blood	2026-03-07	\N	2026-03-31 06:08:35.891308
1200	150	2.8	mmol/L	blood	2026-03-03	\N	2026-03-31 06:08:35.893728
1201	151	1.8	mmol/L	blood	2026-03-31	Home monitoring reading	2026-03-31 06:08:36.01724
1202	151	2.2	mmol/L	blood	2026-03-27	\N	2026-03-31 06:08:36.018979
1203	151	1.8	mmol/L	blood	2026-03-23	\N	2026-03-31 06:08:36.021301
1204	151	1.7	mmol/L	blood	2026-03-19	\N	2026-03-31 06:08:36.023667
1205	151	1.9	mmol/L	blood	2026-03-15	\N	2026-03-31 06:08:36.026593
1206	151	2.1	mmol/L	blood	2026-03-11	\N	2026-03-31 06:08:36.028799
1207	151	2.2	mmol/L	blood	2026-03-07	\N	2026-03-31 06:08:36.030781
1208	151	1.8	mmol/L	blood	2026-03-03	\N	2026-03-31 06:08:36.032797
1209	152	1.2	mmol/L	blood	2026-03-31	Home monitoring reading	2026-03-31 06:08:36.156868
1210	152	1.4	mmol/L	blood	2026-03-27	\N	2026-03-31 06:08:36.159273
1211	152	0.8	mmol/L	blood	2026-03-23	\N	2026-03-31 06:08:36.161228
1212	152	0.9	mmol/L	blood	2026-03-19	\N	2026-03-31 06:08:36.163694
1213	152	1	mmol/L	blood	2026-03-15	\N	2026-03-31 06:08:36.166104
1214	152	1.3	mmol/L	blood	2026-03-11	\N	2026-03-31 06:08:36.16821
1215	152	1.1	mmol/L	blood	2026-03-07	\N	2026-03-31 06:08:36.171041
1216	152	1.4	mmol/L	blood	2026-03-03	\N	2026-03-31 06:08:36.173211
1217	153	3.2	mmol/L	blood	2026-03-31	Home monitoring reading	2026-03-31 06:08:36.297762
1218	153	3.4	mmol/L	blood	2026-03-27	\N	2026-03-31 06:08:36.299944
1219	153	3.4	mmol/L	blood	2026-03-23	\N	2026-03-31 06:08:36.30231
1220	153	3.6	mmol/L	blood	2026-03-19	\N	2026-03-31 06:08:36.304977
1221	153	3.1	mmol/L	blood	2026-03-15	\N	2026-03-31 06:08:36.307321
1222	153	2.9	mmol/L	blood	2026-03-11	\N	2026-03-31 06:08:36.309655
1223	153	3.3	mmol/L	blood	2026-03-07	\N	2026-03-31 06:08:36.312051
1224	153	2.9	mmol/L	blood	2026-03-03	\N	2026-03-31 06:08:36.314063
1225	154	3.2	mmol/L	blood	2026-03-31	Home monitoring reading	2026-03-31 06:08:36.654123
1226	154	2.8	mmol/L	blood	2026-03-27	\N	2026-03-31 06:08:36.656649
1227	154	3.1	mmol/L	blood	2026-03-23	\N	2026-03-31 06:08:36.658923
1228	154	3.1	mmol/L	blood	2026-03-19	\N	2026-03-31 06:08:36.661523
1229	154	2.9	mmol/L	blood	2026-03-15	\N	2026-03-31 06:08:36.663752
1230	154	3.6	mmol/L	blood	2026-03-11	\N	2026-03-31 06:08:36.666208
1231	154	3.3	mmol/L	blood	2026-03-07	\N	2026-03-31 06:08:36.668484
1232	154	3.2	mmol/L	blood	2026-03-03	\N	2026-03-31 06:08:36.671066
1233	155	1.9	mmol/L	blood	2026-03-31	Home monitoring reading	2026-03-31 06:08:36.798123
1234	155	1.7	mmol/L	blood	2026-03-27	\N	2026-03-31 06:08:36.799997
1235	155	1.6	mmol/L	blood	2026-03-23	\N	2026-03-31 06:08:36.802301
1236	155	2.1	mmol/L	blood	2026-03-19	\N	2026-03-31 06:08:36.804428
1237	155	2.1	mmol/L	blood	2026-03-15	\N	2026-03-31 06:08:36.806363
1238	155	1.9	mmol/L	blood	2026-03-11	\N	2026-03-31 06:08:36.808294
1239	155	2	mmol/L	blood	2026-03-07	\N	2026-03-31 06:08:36.81026
1240	155	2.2	mmol/L	blood	2026-03-03	\N	2026-03-31 06:08:36.812285
1241	156	1.2	mmol/L	blood	2026-03-31	Home monitoring reading	2026-03-31 06:08:36.933663
1242	156	1.3	mmol/L	blood	2026-03-27	\N	2026-03-31 06:08:36.936085
1243	156	1.1	mmol/L	blood	2026-03-23	\N	2026-03-31 06:08:36.938376
1244	156	1.6	mmol/L	blood	2026-03-19	\N	2026-03-31 06:08:36.940792
1245	156	1.4	mmol/L	blood	2026-03-15	\N	2026-03-31 06:08:36.942627
1246	156	1.3	mmol/L	blood	2026-03-11	\N	2026-03-31 06:08:36.945075
1247	156	1	mmol/L	blood	2026-03-07	\N	2026-03-31 06:08:36.947364
1248	156	0.9	mmol/L	blood	2026-03-03	\N	2026-03-31 06:08:36.949843
\.


--
-- Data for Name: kid_food_approvals; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.kid_food_approvals (id, kid_id, food_id, status, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: kids; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.kids (id, name, kid_code, date_of_birth, gender, parent_name, parent_contact, phase, doctor_id, current_meal_plan_id, created_at) FROM stdin;
157	John	KID-Y3AVR5	2025-12-10	male	Sarah	0711245788	1	1	\N	2026-04-02 04:09:10.403868
116	Aiden Jackson	KKC-4IGB3	2018-10-07	male	Paul Jackson	+1-555-0112	2	1	38	2026-03-31 06:08:29.104621
119	Amelia Clark	KKC-YV743	2019-12-09	female	Susan Clark	+1-555-0115	2	1	48	2026-03-31 06:08:29.113854
105	Emma Thompson	KKC-FGEST	2019-03-15	female	Mary Thompson	+1-555-0101	2	1	\N	2026-03-31 06:08:29.074174
106	Liam Carter	KKC-3S64S	2018-07-22	male	John Carter	+1-555-0102	1	1	\N	2026-03-31 06:08:29.077462
107	Olivia Martinez	KKC-T7UD9	2020-01-10	female	Rosa Martinez	+1-555-0103	3	1	\N	2026-03-31 06:08:29.080457
108	Noah Williams	KKC-8YIWF	2017-11-05	male	James Williams	+1-555-0104	4	1	\N	2026-03-31 06:08:29.083905
109	Ava Brown	KKC-AP3Y2	2019-09-28	female	Lisa Brown	+1-555-0105	2	1	\N	2026-03-31 06:08:29.086433
110	Ethan Davis	KKC-R7WLP	2018-04-17	male	Robert Davis	+44-7700-900106	1	1	\N	2026-03-31 06:08:29.088866
111	Sophia Wilson	KKC-4FWU9	2020-06-03	female	Jennifer Wilson	+1-555-0107	2	1	\N	2026-03-31 06:08:29.091334
112	Mason Miller	KKC-5ER12	2016-12-19	male	David Miller	+1-555-0108	3	1	\N	2026-03-31 06:08:29.093737
113	Isabella Moore	KKC-VP18U	2019-05-11	female	Sarah Moore	+1-555-0109	1	1	\N	2026-03-31 06:08:29.096607
114	Lucas Taylor	KKC-Q4JC3	2017-08-30	male	Mark Taylor	+44-7700-900110	4	1	\N	2026-03-31 06:08:29.099384
115	Mia Anderson	KKC-O1FDL	2021-02-14	female	Karen Anderson	+1-555-0111	1	1	\N	2026-03-31 06:08:29.101918
117	Charlotte White	KKC-EHY1B	2020-04-22	female	Nancy White	+1-555-0113	3	1	\N	2026-03-31 06:08:29.107815
118	James Harris	KKC-54LQI	2017-01-18	male	Brian Harris	+61-4-0000-0114	4	1	\N	2026-03-31 06:08:29.110889
120	Henry Baker	KKC-09OI4	2018-02-28	male	Tom Baker	+1-555-0116	1	1	\N	2026-03-31 06:08:29.116627
121	Zoe Nguyen	KKC-BWTFQ	2020-08-14	female	Linh Nguyen	+1-555-0117	3	1	\N	2026-03-31 06:08:29.119281
122	Jack Robinson	KKC-464LA	2017-06-21	male	Steve Robinson	+1-555-0118	4	1	\N	2026-03-31 06:08:29.121472
123	Lily Patel	KKC-OB7E3	2019-11-03	female	Priya Patel	+44-7700-900119	2	1	\N	2026-03-31 06:08:29.123912
124	Owen Kim	KKC-J3MMK	2021-04-09	male	Soo-Jin Kim	+1-555-0120	1	1	\N	2026-03-31 06:08:29.126799
125	Ella Gonzalez	KKC-LNG1V	2018-09-17	female	Maria Gonzalez	+1-555-0121	3	1	\N	2026-03-31 06:08:29.128682
126	Leo Murphy	KKC-ZUW23	2016-05-30	male	Sean Murphy	+353-85-000122	4	1	\N	2026-03-31 06:08:29.131043
127	Grace Chen	KKC-KJDBY	2020-12-01	female	Wei Chen	+1-555-0123	1	1	\N	2026-03-31 06:08:29.133496
128	Daniel Evans	KKC-C4FVS	2019-07-25	male	Craig Evans	+44-7700-900124	2	1	\N	2026-03-31 06:08:29.136809
129	Chloe Rivera	KKC-1SB9D	2017-03-12	female	Ana Rivera	+1-555-0125	3	1	\N	2026-03-31 06:08:29.139053
130	Ryan Scott	KKC-HF267	2018-12-08	male	Kevin Scott	+1-555-0126	1	1	\N	2026-03-31 06:08:29.141886
131	Hannah Lewis	KKC-1050W	2020-10-19	female	Angela Lewis	+1-555-0127	2	1	\N	2026-03-31 06:08:29.145277
132	Caleb Walker	KKC-PTG2C	2016-08-06	male	Mike Walker	+1-555-0128	4	1	\N	2026-03-31 06:08:29.148122
133	Aria Sanchez	KKC-AM4ZK	2021-01-23	female	Carmen Sanchez	+1-555-0129	1	1	\N	2026-03-31 06:08:29.150006
134	Benjamin Young	KKC-GU432	2019-04-02	male	Peter Young	+61-4-0000-0130	3	1	\N	2026-03-31 06:08:29.152275
135	Sofia Kowalski	KKC-1G31Z	2025-09-10	female	Anna Kowalski	+48-600-131-000	1	1	\N	2026-03-31 06:08:29.15449
136	Mateo Herrera	KKC-B69L1	2021-07-04	male	Diego Herrera	+52-55-1234-0132	1	1	\N	2026-03-31 06:08:29.157405
137	Isla MacPherson	KKC-2DXF9	2020-03-19	female	Fiona MacPherson	+44-7700-900133	2	1	\N	2026-03-31 06:08:29.159528
138	Elijah Okafor	KKC-6AKWO	2017-10-26	male	Chidi Okafor	+234-803-000-0134	4	1	\N	2026-03-31 06:08:29.162746
139	Freya Larsson	KKC-TBEQW	2019-01-07	female	Ingrid Larsson	+46-70-000-0135	2	1	\N	2026-03-31 06:08:29.165606
140	Kai Tanaka	KKC-8YIB6	2018-05-30	male	Yuki Tanaka	+81-90-0000-0136	3	1	\N	2026-03-31 06:08:29.168402
141	Nora Fitzgerald	KKC-7WZLJ	2020-11-22	female	Sinead Fitzgerald	+353-85-000137	1	1	\N	2026-03-31 06:08:29.170683
142	Theo Müller	KKC-14ZY5	2016-09-14	male	Klaus Müller	+49-170-000-0138	4	1	\N	2026-03-31 06:08:29.173607
143	Aurora Singh	KKC-1UIIH	2021-12-05	female	Gurpreet Singh	+91-98-0000-0139	1	1	\N	2026-03-31 06:08:29.176147
144	Felix Dubois	KKC-RLM2C	2018-08-11	male	Pierre Dubois	+33-6-00-00-0140	2	1	\N	2026-03-31 06:08:29.179155
145	Penelope O'Brien	KKC-VAWMG	2019-06-27	female	Aoife O'Brien	+353-86-000141	3	1	\N	2026-03-31 06:08:29.18153
146	Ryder Johansson	KKC-H7LFK	2017-02-15	male	Erik Johansson	+46-70-000-0142	4	1	\N	2026-03-31 06:08:29.184588
147	Imogen Papadopoulos	KKC-U87GC	2020-07-08	female	Eleni Papadopoulos	+30-697-000-0143	2	1	\N	2026-03-31 06:08:29.187414
148	Axel Petrov	KKC-90QYH	2018-03-21	male	Ivan Petrov	+7-900-000-0144	1	1	\N	2026-03-31 06:08:29.190158
149	Luna Moreau	KKC-6LTG6	2021-10-13	female	Claire Moreau	+33-6-00-00-0145	1	1	\N	2026-03-31 06:08:29.193008
150	Jasper de Vries	KKC-2XZ1E	2016-12-02	male	Willem de Vries	+31-6-0000-0146	3	1	\N	2026-03-31 06:08:29.195391
151	Sienna Russo	KKC-N3OXT	2019-08-18	female	Giulia Russo	+39-347-000-0147	2	1	\N	2026-03-31 06:08:29.198388
152	Declan Walsh	KKC-4Y29L	2022-02-28	male	Patrick Walsh	+353-87-000148	1	1	\N	2026-03-31 06:08:29.201171
153	Valentina Cruz	KKC-PS96A	2018-01-09	female	Isabel Cruz	+34-6-0000-0149	3	1	\N	2026-03-31 06:08:29.203927
154	Hamish Stewart	KKC-ULK7F	2017-05-24	male	Alistair Stewart	+44-7700-900150	4	1	\N	2026-03-31 06:08:29.206957
155	Margot Lefebvre	KKC-JL39F	2020-09-30	female	Brigitte Lefebvre	+32-470-00-0151	2	1	\N	2026-03-31 06:08:29.209352
156	Tobias Andersen	KKC-VP3VQ	2025-06-17	male	Mikkel Andersen	+45-22-000-152	1	1	\N	2026-03-31 06:08:29.211963
\.


--
-- Data for Name: library_meal_plan_items; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.library_meal_plan_items (id, plan_id, meal_type, food_name, portion_grams, unit, calories, carbs, fat, protein, notes, created_at) FROM stdin;
316	48	Breakfast	Cucumber	100	g	15	3.6	0.1	0.7		2026-04-02 04:28:01.367405
249	38	Breakfast	Bacon, Eggs, and Avocado	200	g	490	2	42	30		2026-03-31 06:08:28.826817
250	38	Breakfast	Greek Yogurt with Nuts	100	g	200	5	14	12		2026-03-31 06:08:28.829902
251	38	Lunch	Almond Butter and Celery	60	g	200	3.6	16	6.5		2026-03-31 06:08:28.832519
252	38	Lunch	Beef Ribeye Strips Salad	200	g	520	4	40	35		2026-03-31 06:08:28.835423
253	38	Lunch	Cheddar Cheese Block	40	g	161	0.5	13.2	10		2026-03-31 06:08:28.838739
254	38	Dinner	Chicken Thigh with Cream Sauce	220	g	462	3.3	37.4	30.8		2026-03-31 06:08:28.842259
255	38	Dinner	Roasted Zucchini with Parmesan	120	g	130	4.5	8	6		2026-03-31 06:08:28.844313
256	39	Breakfast	Keto Egg Muffins	120	g	280	2	22	18		2026-03-31 06:08:28.849095
257	39	Breakfast	Macadamia Nuts	20	g	144	1	15.2	1.6		2026-03-31 06:08:28.851869
258	39	Breakfast	Cream Cheese	20	g	68	0.8	6.6	1.2		2026-03-31 06:08:28.854265
259	39	Lunch	Chicken Thigh with Spinach	180	g	350	1.5	26	27		2026-03-31 06:08:28.856598
260	39	Lunch	Pumpkin Seeds with Olive Oil	25	g	145	0.8	12.3	7.5		2026-03-31 06:08:28.858793
261	39	Dinner	Salmon with Butter and Broccoli	200	g	450	4.4	34	30		2026-03-31 06:08:28.861107
317	47	Breakfast	Spinach	100	g	23	1.4	0.4	2.9		2026-04-02 04:30:37.478432
262	40	Breakfast	Bacon with Avocado	120	g	340	1.5	30	16		2026-03-31 06:08:28.866281
263	40	Breakfast	Coconut Cream Smoothie	150	g	280	3	28	2.5		2026-03-31 06:08:28.868528
264	40	Lunch	Turkey Meatballs with Butter	160	g	380	2	28	30		2026-03-31 06:08:28.870836
265	40	Lunch	Cucumber with Cream Cheese	80	g	95	2.5	8	2		2026-03-31 06:08:28.873134
266	40	Dinner	Grilled Salmon with Herb Butter	150	g	380	0	28	32		2026-03-31 06:08:28.87487
267	40	Dinner	Steamed Green Beans with Olive Oil	100	g	65	4	4	2		2026-03-31 06:08:28.878151
286	44	Breakfast	Egg White Omelet with Cheese	150	g	240	1.5	16	24		2026-03-31 06:08:28.934662
287	44	Breakfast	Turkey Sausage	60	g	120	0.5	8	12		2026-03-31 06:08:28.937127
288	44	Lunch	Grilled Chicken with Avocado	200	g	380	3	24	38		2026-03-31 06:08:28.940004
289	44	Lunch	Cottage Cheese	80	g	80	3	4	10		2026-03-31 06:08:28.942316
290	44	Dinner	Beef Steak with Butter	180	g	460	0	32	42		2026-03-31 06:08:28.944871
291	44	Dinner	Steamed Broccoli	100	g	34	4	0.4	2.6		2026-03-31 06:08:28.947336
298	46	Breakfast	Avocado Cocoa Smoothie	200	g	320	6	28	6		2026-03-31 06:08:28.970695
299	46	Breakfast	Cream Cheese Bites	40	g	136	1.6	13.2	2.4		2026-03-31 06:08:28.973577
300	46	Lunch	Coconut Cream Berry Smoothie	200	g	290	8	26	3		2026-03-31 06:08:28.976858
301	46	Lunch	Hard Boiled Egg	50	g	78	0.6	5.3	6.3		2026-03-31 06:08:28.979125
302	46	Dinner	Chicken Bone Broth with Butter	250	g	180	1	14	12		2026-03-31 06:08:28.981378
303	46	Dinner	MCT Oil Vanilla Shake	150	g	260	2	28	1		2026-03-31 06:08:28.983717
304	47	Breakfast	Cheese Roll-Ups with Bacon	100	g	320	1	26	20		2026-03-31 06:08:28.988386
305	47	Breakfast	Cream Cheese	25	g	85	1	8.3	1.5		2026-03-31 06:08:28.990286
306	47	Lunch	Turkey and Cheese Lettuce Wraps	150	g	280	2	20	24		2026-03-31 06:08:28.992887
307	47	Lunch	Celery with Almond Butter	60	g	130	3	10	4		2026-03-31 06:08:28.995287
308	47	Dinner	Baked Chicken Thigh	160	g	340	0	24	30		2026-03-31 06:08:28.997618
309	47	Dinner	Cauliflower with Cheese Sauce	120	g	140	5	10	6		2026-03-31 06:08:28.999812
310	48	Breakfast	Keto Pancakes with Butter	120	g	310	4	26	16		2026-03-31 06:08:29.005104
311	48	Breakfast	Sugar-Free Whipped Cream	30	g	50	0.5	5	0.3		2026-03-31 06:08:29.008068
312	48	Lunch	Cheeseburger Lettuce Wrap	200	g	450	3	34	32		2026-03-31 06:08:29.010682
313	48	Lunch	Avocado Fries (baked)	80	g	160	3	14	2		2026-03-31 06:08:29.012897
314	48	Dinner	Pizza Chicken (cheese-topped)	180	g	380	3	24	36		2026-03-31 06:08:29.015962
315	48	Dinner	Keto Chocolate Fat Bomb	30	g	200	2	20	2		2026-03-31 06:08:29.018217
\.


--
-- Data for Name: library_meal_plans; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.library_meal_plans (id, doctor_id, name, description, created_at, updated_at) FROM stdin;
38	1	Teen Active Keto Plan	Higher calorie ketogenic plan for active teenagers. Supports growth while maintaining therapeutic ketosis.	2026-03-31 06:08:28.823918	2026-03-31 06:08:28.823918
39	1	Snack-Rich Modified Atkins	Modified Atkins approach with structured snacks for children who need frequent small meals throughout the day.	2026-03-31 06:08:28.84666	2026-03-31 06:08:28.84666
40	1	Egg-Free Keto Plan	Designed for children with egg allergies. Relies on meats, fish, nuts, and healthy fats.	2026-03-31 06:08:28.863392	2026-03-31 06:08:28.863392
44	1	High Protein Keto Plan	Higher protein ketogenic plan for children needing muscle support. Protein slightly elevated while maintaining ketosis.	2026-03-31 06:08:28.932006	2026-03-31 06:08:28.932006
47	1	School Day Keto Plan	Designed for school-aged children with easy-to-pack lunch options and quick breakfast meals.	2026-03-31 06:08:28.986167	2026-03-31 06:08:28.986167
48	1	Weekend Treat Keto Plan	Slightly more varied weekend plan with keto-friendly treats. Great for maintaining compliance on weekends.	2026-03-31 06:08:29.002478	2026-03-31 06:08:29.002478
46	1	Ketogenic Smoothie Plan	Smoothie-based ketogenic plan for children who have difficulty eating solid foods.	2026-03-31 06:08:28.968513	2026-03-31 08:29:48.162
\.


--
-- Data for Name: meal_days; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.meal_days (id, kid_id, date, total_meals, completed_meals, missed_meals, is_filled, total_calories, total_carbs, total_fat, total_protein, created_at) FROM stdin;
3641	105	2026-02-25	5	4	1	t	960	13.50691	80	32	2026-03-31 06:08:29.265356
3642	105	2026-02-26	5	4	1	t	960	11.975306	80	32	2026-03-31 06:08:29.26788
3643	105	2026-02-27	5	4	1	t	960	11.691606	80	32	2026-03-31 06:08:29.271203
3644	105	2026-02-28	5	4	1	t	960	14.580348	80	32	2026-03-31 06:08:29.273572
3645	105	2026-03-01	5	4	1	t	960	11.073037	80	32	2026-03-31 06:08:29.276422
3646	105	2026-03-02	5	5	0	t	1200	14.398204	100	40	2026-03-31 06:08:29.278379
3647	105	2026-03-03	5	4	1	t	960	11.229018	80	32	2026-03-31 06:08:29.280866
3648	105	2026-03-04	5	5	0	t	1200	17.681046	100	40	2026-03-31 06:08:29.283273
3649	105	2026-03-05	5	5	0	t	1200	14.158511	100	40	2026-03-31 06:08:29.28529
3650	105	2026-03-06	5	5	0	t	1200	13.831938	100	40	2026-03-31 06:08:29.288365
3651	105	2026-03-07	5	4	1	t	960	10.843365	80	32	2026-03-31 06:08:29.291049
3652	105	2026-03-08	5	4	1	t	960	11.549929	80	32	2026-03-31 06:08:29.294104
3653	105	2026-03-09	5	5	0	t	1200	14.914689	100	40	2026-03-31 06:08:29.296464
3654	105	2026-03-10	5	4	1	t	960	12.456928	80	32	2026-03-31 06:08:29.29838
3655	105	2026-03-11	5	4	1	t	960	12.043435	80	32	2026-03-31 06:08:29.300732
3656	105	2026-03-12	5	4	1	t	960	13.34573	80	32	2026-03-31 06:08:29.303111
3657	105	2026-03-13	5	5	0	t	1200	14.678735	100	40	2026-03-31 06:08:29.305145
3658	105	2026-03-14	5	4	1	t	960	12.565846	80	32	2026-03-31 06:08:29.30745
3659	105	2026-03-15	5	4	1	t	960	11.601204	80	32	2026-03-31 06:08:29.309807
3660	105	2026-03-16	5	5	0	t	1200	15.35973	100	40	2026-03-31 06:08:29.312116
3661	105	2026-03-17	5	5	0	t	1200	16.626741	100	40	2026-03-31 06:08:29.314413
3662	105	2026-03-18	5	4	1	t	960	11.620278	80	32	2026-03-31 06:08:29.316482
3663	105	2026-03-19	5	4	1	t	960	10.872083	80	32	2026-03-31 06:08:29.318748
3664	105	2026-03-20	5	4	1	t	960	12.825871	80	32	2026-03-31 06:08:29.32093
3665	105	2026-03-21	5	5	0	t	1200	13.942194	100	40	2026-03-31 06:08:29.323226
3666	105	2026-03-22	5	5	0	t	1200	15.976396	100	40	2026-03-31 06:08:29.325141
3667	105	2026-03-23	5	5	0	t	1200	15.387998	100	40	2026-03-31 06:08:29.327814
3668	105	2026-03-24	5	5	0	t	1200	17.188255	100	40	2026-03-31 06:08:29.330128
3669	105	2026-03-25	5	5	0	t	1200	17.068571	100	40	2026-03-31 06:08:29.333182
3670	105	2026-03-26	5	5	0	t	1200	14.766743	100	40	2026-03-31 06:08:29.335575
3671	105	2026-03-27	5	5	0	t	1200	16.244568	100	40	2026-03-31 06:08:29.338209
3672	105	2026-03-28	5	4	1	t	960	12.812458	80	32	2026-03-31 06:08:29.340801
3673	105	2026-03-29	5	4	1	t	960	11.919303	80	32	2026-03-31 06:08:29.342582
3674	105	2026-03-30	5	4	1	t	960	11.667765	80	32	2026-03-31 06:08:29.34505
3675	105	2026-03-31	5	4	1	t	960	11.946608	80	32	2026-03-31 06:08:29.34732
3676	106	2026-02-25	5	2	3	f	400	31.016872	34	14	2026-03-31 06:08:29.409331
3677	106	2026-02-26	5	2	3	f	400	31.203949	34	14	2026-03-31 06:08:29.412444
3678	106	2026-02-27	5	2	3	f	400	30.825863	34	14	2026-03-31 06:08:29.414571
3679	106	2026-02-28	5	2	3	f	400	28.97036	34	14	2026-03-31 06:08:29.416746
3680	106	2026-03-01	5	2	3	f	400	30.099823	34	14	2026-03-31 06:08:29.418539
3681	106	2026-03-02	5	2	3	f	400	31.055601	34	14	2026-03-31 06:08:29.420761
3682	106	2026-03-03	5	2	3	f	400	29.880144	34	14	2026-03-31 06:08:29.423038
3683	106	2026-03-04	5	2	3	f	400	28.457481	34	14	2026-03-31 06:08:29.425238
3684	106	2026-03-05	5	2	3	f	400	29.514221	34	14	2026-03-31 06:08:29.4276
3685	106	2026-03-06	5	3	2	f	600	45.50936	51	21	2026-03-31 06:08:29.430224
3686	106	2026-03-07	5	2	3	f	400	30.905329	34	14	2026-03-31 06:08:29.432668
3687	106	2026-03-08	5	2	3	f	400	28.24512	34	14	2026-03-31 06:08:29.435038
3688	106	2026-03-09	5	2	3	f	400	29.35244	34	14	2026-03-31 06:08:29.436838
3689	106	2026-03-10	5	2	3	f	400	30.369257	34	14	2026-03-31 06:08:29.439241
3690	106	2026-03-11	5	2	3	f	400	30.4157	34	14	2026-03-31 06:08:29.441509
3691	106	2026-03-12	5	2	3	f	400	30.761095	34	14	2026-03-31 06:08:29.443545
3692	106	2026-03-13	5	2	3	f	400	29.316319	34	14	2026-03-31 06:08:29.445797
3693	106	2026-03-14	5	3	2	t	600	43.62989	51	21	2026-03-31 06:08:29.448217
3694	106	2026-03-15	5	2	3	t	400	30.381752	34	14	2026-03-31 06:08:29.450747
3695	106	2026-03-16	5	2	3	t	400	29.717617	34	14	2026-03-31 06:08:29.452792
3696	106	2026-03-17	5	2	3	t	400	28.623648	34	14	2026-03-31 06:08:29.455306
3697	106	2026-03-18	5	2	3	t	400	28.868595	34	14	2026-03-31 06:08:29.457536
3698	106	2026-03-19	5	2	3	t	400	30.129051	34	14	2026-03-31 06:08:29.459293
3699	106	2026-03-20	5	2	3	t	400	28.80822	34	14	2026-03-31 06:08:29.461541
3700	106	2026-03-21	5	2	3	t	400	31.274218	34	14	2026-03-31 06:08:29.464064
3701	106	2026-03-22	5	2	3	t	400	27.537003	34	14	2026-03-31 06:08:29.466415
3702	106	2026-03-23	5	2	3	t	400	28.642195	34	14	2026-03-31 06:08:29.468357
3703	106	2026-03-24	5	2	3	t	400	31.201899	34	14	2026-03-31 06:08:29.470669
3704	106	2026-03-25	5	2	3	t	400	28.111378	34	14	2026-03-31 06:08:29.472479
3705	106	2026-03-26	5	2	3	t	400	28.2246	34	14	2026-03-31 06:08:29.474771
3706	106	2026-03-27	5	2	3	t	400	27.851225	34	14	2026-03-31 06:08:29.477235
3707	106	2026-03-28	5	2	3	t	400	28.833794	34	14	2026-03-31 06:08:29.479255
3708	106	2026-03-29	5	2	3	t	400	27.585005	34	14	2026-03-31 06:08:29.481345
3709	106	2026-03-30	5	2	3	t	400	27.7336	34	14	2026-03-31 06:08:29.484221
3710	106	2026-03-31	5	2	3	t	400	27.86693	34	14	2026-03-31 06:08:29.486537
3711	107	2026-02-25	5	4	1	f	1120	9.665139	96	36	2026-03-31 06:08:29.549365
3712	107	2026-02-26	5	4	1	f	1120	10.810672	96	36	2026-03-31 06:08:29.551597
3713	107	2026-02-27	5	4	1	t	1120	10.371204	96	36	2026-03-31 06:08:29.553469
3714	107	2026-02-28	5	5	0	t	1400	11.9641075	120	45	2026-03-31 06:08:29.555594
3715	107	2026-03-01	5	4	1	t	1120	8.460357	96	36	2026-03-31 06:08:29.557909
3716	107	2026-03-02	5	5	0	t	1400	11.158143	120	45	2026-03-31 06:08:29.560095
3717	107	2026-03-03	5	5	0	t	1400	11.125578	120	45	2026-03-31 06:08:29.562196
3718	107	2026-03-04	5	5	0	t	1400	11.913299	120	45	2026-03-31 06:08:29.564309
3719	107	2026-03-05	5	4	1	t	1120	8.097255	96	36	2026-03-31 06:08:29.566518
3720	107	2026-03-06	5	4	1	t	1120	8.635487	96	36	2026-03-31 06:08:29.568859
3721	107	2026-03-07	5	5	0	t	1400	12.995637	120	45	2026-03-31 06:08:29.571287
3722	107	2026-03-08	5	5	0	t	1400	12.252395	120	45	2026-03-31 06:08:29.57402
3723	107	2026-03-09	5	4	1	t	1120	9.511993	96	36	2026-03-31 06:08:29.576971
3724	107	2026-03-10	5	4	1	t	1120	8.132808	96	36	2026-03-31 06:08:29.579243
3725	107	2026-03-11	5	4	1	t	1120	11.774734	96	36	2026-03-31 06:08:29.581602
3726	107	2026-03-12	5	5	0	t	1400	10.155783	120	45	2026-03-31 06:08:29.584182
3727	107	2026-03-13	5	4	1	t	1120	9.785765	96	36	2026-03-31 06:08:29.586755
3728	107	2026-03-14	5	4	1	t	1120	11.748051	96	36	2026-03-31 06:08:29.588527
3729	107	2026-03-15	5	4	1	t	1120	9.129179	96	36	2026-03-31 06:08:29.590814
3730	107	2026-03-16	5	4	1	t	1120	8.741613	96	36	2026-03-31 06:08:29.592676
3731	107	2026-03-17	5	4	1	t	1120	9.626445	96	36	2026-03-31 06:08:29.595069
3732	107	2026-03-18	5	4	1	t	1120	10.770014	96	36	2026-03-31 06:08:29.597885
3733	107	2026-03-19	5	4	1	t	1120	9.707524	96	36	2026-03-31 06:08:29.599768
3734	107	2026-03-20	5	5	0	t	1400	10.818536	120	45	2026-03-31 06:08:29.601933
3735	107	2026-03-21	5	4	1	t	1120	10.788769	96	36	2026-03-31 06:08:29.604146
3736	107	2026-03-22	5	4	1	t	1120	9.980927	96	36	2026-03-31 06:08:29.606363
3737	107	2026-03-23	5	4	1	t	1120	10.234601	96	36	2026-03-31 06:08:29.609157
3738	107	2026-03-24	5	4	1	t	1120	11.256765	96	36	2026-03-31 06:08:29.611453
3739	107	2026-03-25	5	4	1	t	1120	7.8604484	96	36	2026-03-31 06:08:29.614015
3740	107	2026-03-26	5	4	1	t	1120	10.233102	96	36	2026-03-31 06:08:29.616043
3741	107	2026-03-27	5	4	1	t	1120	7.921487	96	36	2026-03-31 06:08:29.618358
3742	107	2026-03-28	5	4	1	t	1120	9.528041	96	36	2026-03-31 06:08:29.620557
3743	107	2026-03-29	5	4	1	t	1120	8.767687	96	36	2026-03-31 06:08:29.622935
3744	107	2026-03-30	5	4	1	t	1120	9.041739	96	36	2026-03-31 06:08:29.625438
3745	107	2026-03-31	5	4	1	t	1120	8.597523	96	36	2026-03-31 06:08:29.627899
3746	108	2026-02-25	5	5	0	t	1600	14.18285	135	50	2026-03-31 06:08:29.693873
3747	108	2026-02-26	5	5	0	t	1600	14.688377	135	50	2026-03-31 06:08:29.696175
3748	108	2026-02-27	5	4	1	t	1280	11.052635	108	40	2026-03-31 06:08:29.698372
3749	108	2026-02-28	5	5	0	t	1600	15.811889	135	50	2026-03-31 06:08:29.700605
3750	108	2026-03-01	5	5	0	t	1600	16.680286	135	50	2026-03-31 06:08:29.702764
3751	108	2026-03-02	5	5	0	t	1600	16.765938	135	50	2026-03-31 06:08:29.705032
3752	108	2026-03-03	5	5	0	t	1600	15.171391	135	50	2026-03-31 06:08:29.707048
3753	108	2026-03-04	5	4	1	t	1280	13.47426	108	40	2026-03-31 06:08:29.709867
3754	108	2026-03-05	5	5	0	t	1600	13.86373	135	50	2026-03-31 06:08:29.712682
3755	108	2026-03-06	5	5	0	t	1600	14.61166	135	50	2026-03-31 06:08:29.715018
3756	108	2026-03-07	5	4	1	t	1280	11.317648	108	40	2026-03-31 06:08:29.717584
3757	108	2026-03-08	5	5	0	t	1600	16.636091	135	50	2026-03-31 06:08:29.720567
3758	108	2026-03-09	5	5	0	t	1600	17.209852	135	50	2026-03-31 06:08:29.723173
3759	108	2026-03-10	5	5	0	t	1600	16.124924	135	50	2026-03-31 06:08:29.725158
3760	108	2026-03-11	5	5	0	t	1600	16.347975	135	50	2026-03-31 06:08:29.727011
3761	108	2026-03-12	5	5	0	t	1600	17.77499	135	50	2026-03-31 06:08:29.729469
3762	108	2026-03-13	5	5	0	t	1600	14.513545	135	50	2026-03-31 06:08:29.731673
3763	108	2026-03-14	5	5	0	t	1600	15.82298	135	50	2026-03-31 06:08:29.734058
3764	108	2026-03-15	5	5	0	t	1600	14.850709	135	50	2026-03-31 06:08:29.736235
3765	108	2026-03-16	5	5	0	t	1600	15.449775	135	50	2026-03-31 06:08:29.738934
3766	108	2026-03-17	5	5	0	t	1600	16.360619	135	50	2026-03-31 06:08:29.740871
3767	108	2026-03-18	5	5	0	t	1600	15.030866	135	50	2026-03-31 06:08:29.7432
3768	108	2026-03-19	5	5	0	t	1600	14.340867	135	50	2026-03-31 06:08:29.745269
3769	108	2026-03-20	5	5	0	t	1600	16.827894	135	50	2026-03-31 06:08:29.748066
3770	108	2026-03-21	5	4	1	t	1280	13.983509	108	40	2026-03-31 06:08:29.750282
3771	108	2026-03-22	5	5	0	t	1600	17.412245	135	50	2026-03-31 06:08:29.75243
3772	108	2026-03-23	5	5	0	t	1600	16.577549	135	50	2026-03-31 06:08:29.754194
3773	108	2026-03-24	5	5	0	t	1600	14.912074	135	50	2026-03-31 06:08:29.756839
3774	108	2026-03-25	5	5	0	t	1600	17.708313	135	50	2026-03-31 06:08:29.759023
3775	108	2026-03-26	5	4	1	t	1280	14.2669935	108	40	2026-03-31 06:08:29.761401
3776	108	2026-03-27	5	4	1	t	1280	11.274273	108	40	2026-03-31 06:08:29.763231
3777	108	2026-03-28	5	5	0	t	1600	15.39054	135	50	2026-03-31 06:08:29.76546
3778	108	2026-03-29	5	5	0	t	1600	16.605412	135	50	2026-03-31 06:08:29.767761
3779	108	2026-03-30	5	5	0	t	1600	16.415628	135	50	2026-03-31 06:08:29.770027
3780	108	2026-03-31	5	5	0	t	1600	14.533841	135	50	2026-03-31 06:08:29.772743
3781	109	2026-02-25	5	1	4	f	240	16.191433	20	8	2026-03-31 06:08:29.93424
3782	109	2026-02-26	5	2	3	f	480	35.84255	40	16	2026-03-31 06:08:29.935991
3783	109	2026-02-27	5	1	4	f	240	16.374907	20	8	2026-03-31 06:08:29.938864
3784	109	2026-02-28	5	2	3	f	480	36.389534	40	16	2026-03-31 06:08:29.941049
3785	109	2026-03-01	5	2	3	f	480	36.583233	40	16	2026-03-31 06:08:29.943311
3786	109	2026-03-02	5	1	4	f	240	18.456047	20	8	2026-03-31 06:08:29.945527
3787	109	2026-03-03	5	1	4	f	240	18.423042	20	8	2026-03-31 06:08:29.947744
3788	109	2026-03-04	5	1	4	f	240	17.748474	20	8	2026-03-31 06:08:29.950289
3789	109	2026-03-05	5	2	3	f	480	34.21416	40	16	2026-03-31 06:08:29.95251
3790	109	2026-03-06	5	2	3	f	480	35.569344	40	16	2026-03-31 06:08:29.954642
3791	109	2026-03-07	5	1	4	f	240	16.947178	20	8	2026-03-31 06:08:29.957081
3792	109	2026-03-08	5	2	3	f	480	35.4517	40	16	2026-03-31 06:08:29.959348
3793	109	2026-03-09	5	1	4	f	240	16.841213	20	8	2026-03-31 06:08:29.962219
3794	109	2026-03-10	5	2	3	f	480	36.631283	40	16	2026-03-31 06:08:29.964442
3795	109	2026-03-11	5	1	4	f	240	16.6183	20	8	2026-03-31 06:08:29.966773
3796	109	2026-03-12	5	1	4	f	240	17.888071	20	8	2026-03-31 06:08:29.969698
3797	109	2026-03-13	5	1	4	f	240	17.461554	20	8	2026-03-31 06:08:29.972854
3798	109	2026-03-14	5	2	3	f	480	34.218246	40	16	2026-03-31 06:08:29.975527
3799	109	2026-03-15	5	2	3	f	480	34.189156	40	16	2026-03-31 06:08:29.978262
3800	109	2026-03-16	5	1	4	f	240	18.098267	20	8	2026-03-31 06:08:29.982047
3801	109	2026-03-17	5	1	4	f	240	16.929415	20	8	2026-03-31 06:08:29.984405
3802	109	2026-03-18	5	2	3	f	480	34.808384	40	16	2026-03-31 06:08:29.986989
3803	109	2026-03-19	5	1	4	t	240	16.990587	20	8	2026-03-31 06:08:29.989373
3804	109	2026-03-20	5	2	3	t	480	34.75267	40	16	2026-03-31 06:08:29.991717
3805	109	2026-03-21	5	2	3	t	480	33.45473	40	16	2026-03-31 06:08:29.994352
3806	109	2026-03-22	5	1	4	t	240	16.770311	20	8	2026-03-31 06:08:29.996872
3807	109	2026-03-23	5	1	4	t	240	16.532438	20	8	2026-03-31 06:08:30.000145
3808	109	2026-03-24	5	1	4	t	240	18.30859	20	8	2026-03-31 06:08:30.004215
3809	109	2026-03-25	5	2	3	t	480	36.189964	40	16	2026-03-31 06:08:30.007779
3810	109	2026-03-26	5	1	4	t	240	18.778952	20	8	2026-03-31 06:08:30.010736
3811	109	2026-03-27	5	1	4	t	240	16.553343	20	8	2026-03-31 06:08:30.013046
3812	109	2026-03-28	5	2	3	t	480	33.153873	40	16	2026-03-31 06:08:30.015329
3813	109	2026-03-29	5	2	3	t	480	36.893456	40	16	2026-03-31 06:08:30.017618
3814	109	2026-03-30	5	1	4	t	240	16.409256	20	8	2026-03-31 06:08:30.019759
3815	109	2026-03-31	5	1	4	t	240	19.529694	20	8	2026-03-31 06:08:30.022368
3816	110	2026-02-25	5	4	1	f	800	14.720083	68	28	2026-03-31 06:08:30.083046
3817	110	2026-02-26	5	3	2	f	600	13.280644	51	21	2026-03-31 06:08:30.085882
3818	110	2026-02-27	5	3	2	f	600	10.21886	51	21	2026-03-31 06:08:30.088586
3819	110	2026-02-28	5	3	2	f	600	11.021165	51	21	2026-03-31 06:08:30.090697
3820	110	2026-03-01	5	3	2	f	600	10.361626	51	21	2026-03-31 06:08:30.092784
3821	110	2026-03-02	5	4	1	f	800	15.795744	68	28	2026-03-31 06:08:30.095066
3822	110	2026-03-03	5	3	2	f	600	13.496258	51	21	2026-03-31 06:08:30.097342
3823	110	2026-03-04	5	4	1	t	800	14.746142	68	28	2026-03-31 06:08:30.09914
3824	110	2026-03-05	5	3	2	t	600	13.99757	51	21	2026-03-31 06:08:30.10155
3825	110	2026-03-06	5	3	2	t	600	11.813246	51	21	2026-03-31 06:08:30.103834
3826	110	2026-03-07	5	4	1	t	800	13.932042	68	28	2026-03-31 06:08:30.106099
3827	110	2026-03-08	5	4	1	t	800	17.113964	68	28	2026-03-31 06:08:30.108327
3828	110	2026-03-09	5	4	1	t	800	14.175903	68	28	2026-03-31 06:08:30.11056
3829	110	2026-03-10	5	3	2	t	600	11.297384	51	21	2026-03-31 06:08:30.11279
3830	110	2026-03-11	5	3	2	t	600	11.539107	51	21	2026-03-31 06:08:30.114558
3831	110	2026-03-12	5	4	1	t	800	14.794912	68	28	2026-03-31 06:08:30.117348
3832	110	2026-03-13	5	4	1	t	800	16.495935	68	28	2026-03-31 06:08:30.119543
3833	110	2026-03-14	5	4	1	t	800	16.479328	68	28	2026-03-31 06:08:30.121732
3834	110	2026-03-15	5	4	1	t	800	17.774899	68	28	2026-03-31 06:08:30.123832
3835	110	2026-03-16	5	3	2	t	600	10.972882	51	21	2026-03-31 06:08:30.125954
3836	110	2026-03-17	5	4	1	t	800	16.435648	68	28	2026-03-31 06:08:30.127752
3837	110	2026-03-18	5	3	2	t	600	11.340883	51	21	2026-03-31 06:08:30.130724
3838	110	2026-03-19	5	3	2	t	600	12.233752	51	21	2026-03-31 06:08:30.132946
3839	110	2026-03-20	5	3	2	t	600	12.882051	51	21	2026-03-31 06:08:30.134776
3840	110	2026-03-21	5	4	1	t	800	17.527998	68	28	2026-03-31 06:08:30.136885
3841	110	2026-03-22	5	4	1	t	800	16.532053	68	28	2026-03-31 06:08:30.139137
3842	110	2026-03-23	5	4	1	t	800	16.021347	68	28	2026-03-31 06:08:30.141564
3843	110	2026-03-24	5	3	2	t	600	11.19506	51	21	2026-03-31 06:08:30.143504
3844	110	2026-03-25	5	3	2	t	600	11.831497	51	21	2026-03-31 06:08:30.145359
3845	110	2026-03-26	5	4	1	t	800	14.403226	68	28	2026-03-31 06:08:30.14823
3846	110	2026-03-27	5	4	1	t	800	16.481308	68	28	2026-03-31 06:08:30.150202
3847	110	2026-03-28	5	4	1	t	800	16.066458	68	28	2026-03-31 06:08:30.152211
3848	110	2026-03-29	5	4	1	t	800	17.14512	68	28	2026-03-31 06:08:30.153858
3849	110	2026-03-30	5	3	2	t	600	14.024511	51	21	2026-03-31 06:08:30.156501
3850	110	2026-03-31	5	4	1	t	800	17.595545	68	28	2026-03-31 06:08:30.158669
3851	111	2026-02-25	5	5	0	f	1200	14.006631	100	40	2026-03-31 06:08:30.218612
3852	111	2026-02-26	5	4	1	t	960	12.87041	80	32	2026-03-31 06:08:30.220739
3853	111	2026-02-27	5	4	1	t	960	13.755781	80	32	2026-03-31 06:08:30.222996
3854	111	2026-02-28	5	4	1	t	960	11.939996	80	32	2026-03-31 06:08:30.225211
3855	111	2026-03-01	5	5	0	t	1200	16.806557	100	40	2026-03-31 06:08:30.227443
3856	111	2026-03-02	5	4	1	t	960	11.449172	80	32	2026-03-31 06:08:30.22967
3857	111	2026-03-03	5	4	1	t	960	12.653451	80	32	2026-03-31 06:08:30.231818
3858	111	2026-03-04	5	5	0	t	1200	14.573952	100	40	2026-03-31 06:08:30.234153
3859	111	2026-03-05	5	5	0	t	1200	15.012796	100	40	2026-03-31 06:08:30.236414
3860	111	2026-03-06	5	5	0	t	1200	14.681267	100	40	2026-03-31 06:08:30.23925
3861	111	2026-03-07	5	4	1	t	960	12.821944	80	32	2026-03-31 06:08:30.241636
3862	111	2026-03-08	5	4	1	t	960	13.011167	80	32	2026-03-31 06:08:30.243517
3863	111	2026-03-09	5	5	0	t	1200	14.919181	100	40	2026-03-31 06:08:30.245595
3864	111	2026-03-10	5	5	0	t	1200	16.28557	100	40	2026-03-31 06:08:30.247749
3865	111	2026-03-11	5	5	0	t	1200	15.291306	100	40	2026-03-31 06:08:30.249864
3866	111	2026-03-12	5	4	1	t	960	11.955288	80	32	2026-03-31 06:08:30.251811
3867	111	2026-03-13	5	5	0	t	1200	15.6623535	100	40	2026-03-31 06:08:30.254444
3868	111	2026-03-14	5	4	1	t	960	14.7673	80	32	2026-03-31 06:08:30.256736
3869	111	2026-03-15	5	4	1	t	960	13.925306	80	32	2026-03-31 06:08:30.258904
3870	111	2026-03-16	5	4	1	t	960	13.236727	80	32	2026-03-31 06:08:30.26112
3871	111	2026-03-17	5	5	0	t	1200	17.351305	100	40	2026-03-31 06:08:30.263386
3872	111	2026-03-18	5	4	1	t	960	11.991897	80	32	2026-03-31 06:08:30.265782
3873	111	2026-03-19	5	5	0	t	1200	16.760406	100	40	2026-03-31 06:08:30.268726
3874	111	2026-03-20	5	4	1	t	960	11.855243	80	32	2026-03-31 06:08:30.270681
3875	111	2026-03-21	5	5	0	t	1200	15.609081	100	40	2026-03-31 06:08:30.272844
3876	111	2026-03-22	5	5	0	t	1200	17.70459	100	40	2026-03-31 06:08:30.275204
3877	111	2026-03-23	5	4	1	t	960	10.893632	80	32	2026-03-31 06:08:30.277451
3878	111	2026-03-24	5	4	1	t	960	12.117875	80	32	2026-03-31 06:08:30.279727
3879	111	2026-03-25	5	4	1	t	960	12.101368	80	32	2026-03-31 06:08:30.281972
3880	111	2026-03-26	5	4	1	t	960	14.508893	80	32	2026-03-31 06:08:30.284362
3881	111	2026-03-27	5	5	0	t	1200	15.248769	100	40	2026-03-31 06:08:30.286502
3882	111	2026-03-28	5	4	1	t	960	14.491457	80	32	2026-03-31 06:08:30.288381
3883	111	2026-03-29	5	5	0	t	1200	15.583726	100	40	2026-03-31 06:08:30.290629
3884	111	2026-03-30	5	5	0	t	1200	16.360004	100	40	2026-03-31 06:08:30.292737
3885	111	2026-03-31	5	4	1	t	960	13.845859	80	32	2026-03-31 06:08:30.29509
3886	112	2026-02-25	5	3	2	f	840	17.970407	72	27	2026-03-31 06:08:30.354394
3887	112	2026-02-26	5	3	2	f	840	17.105299	72	27	2026-03-31 06:08:30.356871
3888	112	2026-02-27	5	3	2	f	840	19.074543	72	27	2026-03-31 06:08:30.359119
3889	112	2026-02-28	5	3	2	f	840	16.293926	72	27	2026-03-31 06:08:30.361698
3890	112	2026-03-01	5	3	2	f	840	18.398767	72	27	2026-03-31 06:08:30.363939
3891	112	2026-03-02	5	3	2	f	840	19.962448	72	27	2026-03-31 06:08:30.366391
3892	112	2026-03-03	5	3	2	f	840	16.878206	72	27	2026-03-31 06:08:30.368621
3893	112	2026-03-04	5	3	2	f	840	18.403364	72	27	2026-03-31 06:08:30.371156
3894	112	2026-03-05	5	3	2	f	840	16.513596	72	27	2026-03-31 06:08:30.373056
3895	112	2026-03-06	5	3	2	f	840	19.402437	72	27	2026-03-31 06:08:30.375298
3896	112	2026-03-07	5	3	2	t	840	16.777336	72	27	2026-03-31 06:08:30.377864
3897	112	2026-03-08	5	3	2	t	840	16.811966	72	27	2026-03-31 06:08:30.380132
3898	112	2026-03-09	5	3	2	t	840	18.402502	72	27	2026-03-31 06:08:30.3821
3899	112	2026-03-10	5	3	2	t	840	17.124975	72	27	2026-03-31 06:08:30.384364
3900	112	2026-03-11	5	3	2	t	840	19.931473	72	27	2026-03-31 06:08:30.386669
3901	112	2026-03-12	5	3	2	t	840	18.837614	72	27	2026-03-31 06:08:30.388945
3902	112	2026-03-13	5	3	2	t	840	17.77915	72	27	2026-03-31 06:08:30.39131
3903	112	2026-03-14	5	3	2	t	840	17.0396	72	27	2026-03-31 06:08:30.393404
3904	112	2026-03-15	5	4	1	t	1120	23.200846	96	36	2026-03-31 06:08:30.39573
3905	112	2026-03-16	5	3	2	t	840	17.348368	72	27	2026-03-31 06:08:30.398051
3906	112	2026-03-17	5	3	2	t	840	18.057901	72	27	2026-03-31 06:08:30.400693
3907	112	2026-03-18	5	3	2	t	840	17.838581	72	27	2026-03-31 06:08:30.402387
3908	112	2026-03-19	5	3	2	t	840	17.510336	72	27	2026-03-31 06:08:30.405027
3909	112	2026-03-20	5	3	2	t	840	16.384699	72	27	2026-03-31 06:08:30.407168
3910	112	2026-03-21	5	3	2	t	840	18.365217	72	27	2026-03-31 06:08:30.409289
3911	112	2026-03-22	5	3	2	t	840	17.822273	72	27	2026-03-31 06:08:30.410995
3912	112	2026-03-23	5	3	2	t	840	20.00149	72	27	2026-03-31 06:08:30.413244
3913	112	2026-03-24	5	4	1	t	1120	23.330822	96	36	2026-03-31 06:08:30.416235
3914	112	2026-03-25	5	3	2	t	840	19.836905	72	27	2026-03-31 06:08:30.418599
3915	112	2026-03-26	5	3	2	t	840	19.06683	72	27	2026-03-31 06:08:30.420357
3916	112	2026-03-27	5	3	2	t	840	18.565748	72	27	2026-03-31 06:08:30.423049
3917	112	2026-03-28	5	4	1	t	1120	23.693176	96	36	2026-03-31 06:08:30.425292
3918	112	2026-03-29	5	4	1	t	1120	24.746365	96	36	2026-03-31 06:08:30.427498
3919	112	2026-03-30	5	3	2	t	840	19.071457	72	27	2026-03-31 06:08:30.429666
3920	112	2026-03-31	5	3	2	t	840	16.924002	72	27	2026-03-31 06:08:30.431726
3921	113	2026-02-25	5	3	2	f	600	10.831371	51	21	2026-03-31 06:08:30.491049
3922	113	2026-02-26	5	4	1	f	800	14.85059	68	28	2026-03-31 06:08:30.492739
3923	113	2026-02-27	5	3	2	f	600	11.308245	51	21	2026-03-31 06:08:30.495104
3924	113	2026-02-28	5	3	2	f	600	13.615306	51	21	2026-03-31 06:08:30.497359
3925	113	2026-03-01	5	3	2	f	600	10.417772	51	21	2026-03-31 06:08:30.499197
3926	113	2026-03-02	5	3	2	t	600	13.617984	51	21	2026-03-31 06:08:30.5014
3927	113	2026-03-03	5	4	1	t	800	17.120312	68	28	2026-03-31 06:08:30.503574
3928	113	2026-03-04	5	4	1	t	800	14.575224	68	28	2026-03-31 06:08:30.505458
3929	113	2026-03-05	5	3	2	t	600	13.472061	51	21	2026-03-31 06:08:30.507302
3930	113	2026-03-06	5	4	1	t	800	14.822463	68	28	2026-03-31 06:08:30.510078
3931	113	2026-03-07	5	4	1	t	800	15.458272	68	28	2026-03-31 06:08:30.512292
3932	113	2026-03-08	5	4	1	t	800	16.034101	68	28	2026-03-31 06:08:30.514703
3933	113	2026-03-09	5	3	2	t	600	12.929154	51	21	2026-03-31 06:08:30.516831
3934	113	2026-03-10	5	3	2	t	600	12.840672	51	21	2026-03-31 06:08:30.519041
3935	113	2026-03-11	5	4	1	t	800	16.490992	68	28	2026-03-31 06:08:30.521267
3936	113	2026-03-12	5	4	1	t	800	13.982013	68	28	2026-03-31 06:08:30.523033
3937	113	2026-03-13	5	3	2	t	600	10.268595	51	21	2026-03-31 06:08:30.525242
3938	113	2026-03-14	5	4	1	t	800	17.768524	68	28	2026-03-31 06:08:30.527055
3939	113	2026-03-15	5	4	1	t	800	16.609324	68	28	2026-03-31 06:08:30.529705
3940	113	2026-03-16	5	3	2	t	600	12.015931	51	21	2026-03-31 06:08:30.532032
3941	113	2026-03-17	5	3	2	t	600	12.889616	51	21	2026-03-31 06:08:30.534258
3942	113	2026-03-18	5	3	2	t	600	11.653433	51	21	2026-03-31 06:08:30.536065
3943	113	2026-03-19	5	4	1	t	800	17.408302	68	28	2026-03-31 06:08:30.538278
3944	113	2026-03-20	5	4	1	t	800	16.819172	68	28	2026-03-31 06:08:30.540878
3945	113	2026-03-21	5	4	1	t	800	14.562116	68	28	2026-03-31 06:08:30.54301
3946	113	2026-03-22	5	4	1	t	800	17.784008	68	28	2026-03-31 06:08:30.545354
3947	113	2026-03-23	5	4	1	t	800	14.700253	68	28	2026-03-31 06:08:30.547577
3948	113	2026-03-24	5	4	1	t	800	17.181217	68	28	2026-03-31 06:08:30.550022
3949	113	2026-03-25	5	4	1	t	800	15.278258	68	28	2026-03-31 06:08:30.551688
3950	113	2026-03-26	5	4	1	t	800	17.646215	68	28	2026-03-31 06:08:30.554149
3951	113	2026-03-27	5	3	2	t	600	10.962384	51	21	2026-03-31 06:08:30.556717
3952	113	2026-03-28	5	4	1	t	800	16.849651	68	28	2026-03-31 06:08:30.55899
3953	113	2026-03-29	5	4	1	t	800	15.755015	68	28	2026-03-31 06:08:30.560745
3954	113	2026-03-30	5	4	1	t	800	15.327568	68	28	2026-03-31 06:08:30.56289
3955	113	2026-03-31	5	4	1	t	800	15.814864	68	28	2026-03-31 06:08:30.565007
3956	114	2026-02-25	5	3	2	f	960	31.927483	81	30	2026-03-31 06:08:30.626555
3957	114	2026-02-26	5	3	2	f	960	31.464935	81	30	2026-03-31 06:08:30.628421
3958	114	2026-02-27	5	2	3	f	640	21.566147	54	20	2026-03-31 06:08:30.630776
3959	114	2026-02-28	5	2	3	f	640	23.35185	54	20	2026-03-31 06:08:30.63308
3960	114	2026-03-01	5	3	2	f	960	34.290672	81	30	2026-03-31 06:08:30.635265
3961	114	2026-03-02	5	2	3	f	640	20.281178	54	20	2026-03-31 06:08:30.637246
3962	114	2026-03-03	5	2	3	f	640	20.822184	54	20	2026-03-31 06:08:30.639557
3963	114	2026-03-04	5	2	3	f	640	21.308992	54	20	2026-03-31 06:08:30.641891
3964	114	2026-03-05	5	2	3	f	640	22.817785	54	20	2026-03-31 06:08:30.643984
3965	114	2026-03-06	5	2	3	f	640	21.917856	54	20	2026-03-31 06:08:30.646331
3966	114	2026-03-07	5	3	2	f	960	31.33381	81	30	2026-03-31 06:08:30.648502
3967	114	2026-03-08	5	3	2	f	960	33.610058	81	30	2026-03-31 06:08:30.650594
3968	114	2026-03-09	5	2	3	f	640	20.428867	54	20	2026-03-31 06:08:30.653293
3969	114	2026-03-10	5	2	3	f	640	20.458715	54	20	2026-03-31 06:08:30.655432
3970	114	2026-03-11	5	3	2	f	960	33.7668	81	30	2026-03-31 06:08:30.657644
3971	114	2026-03-12	5	2	3	f	640	20.899408	54	20	2026-03-31 06:08:30.65976
3972	114	2026-03-13	5	2	3	t	640	20.575089	54	20	2026-03-31 06:08:30.661988
3973	114	2026-03-14	5	2	3	t	640	22.743126	54	20	2026-03-31 06:08:30.664285
3974	114	2026-03-15	5	2	3	t	640	21.33566	54	20	2026-03-31 06:08:30.666754
3975	114	2026-03-16	5	3	2	t	960	31.33393	81	30	2026-03-31 06:08:30.668776
3976	114	2026-03-17	5	2	3	t	640	23.581406	54	20	2026-03-31 06:08:30.670724
3977	114	2026-03-18	5	3	2	t	960	31.680523	81	30	2026-03-31 06:08:30.673178
3978	114	2026-03-19	5	3	2	t	960	33.48479	81	30	2026-03-31 06:08:30.675767
3979	114	2026-03-20	5	2	3	t	640	21.7335	54	20	2026-03-31 06:08:30.677664
3980	114	2026-03-21	5	2	3	t	640	22.152164	54	20	2026-03-31 06:08:30.679348
3981	114	2026-03-22	5	2	3	t	640	20.610624	54	20	2026-03-31 06:08:30.681309
3982	114	2026-03-23	5	3	2	t	960	33.9256	81	30	2026-03-31 06:08:30.68386
3983	114	2026-03-24	5	3	2	t	960	31.985552	81	30	2026-03-31 06:08:30.686198
3984	114	2026-03-25	5	2	3	t	640	20.741081	54	20	2026-03-31 06:08:30.688286
3985	114	2026-03-26	5	2	3	t	640	21.151829	54	20	2026-03-31 06:08:30.691143
3986	114	2026-03-27	5	2	3	t	640	23.546583	54	20	2026-03-31 06:08:30.69363
3987	114	2026-03-28	5	2	3	t	640	22.933393	54	20	2026-03-31 06:08:30.695446
3988	114	2026-03-29	5	2	3	t	640	20.676905	54	20	2026-03-31 06:08:30.697904
3989	114	2026-03-30	5	3	2	t	960	33.260044	81	30	2026-03-31 06:08:30.700281
3990	114	2026-03-31	5	2	3	t	640	22.965136	54	20	2026-03-31 06:08:30.702087
3991	115	2026-02-25	5	4	1	t	800	17.091265	68	28	2026-03-31 06:08:30.762187
3992	115	2026-02-26	5	5	0	t	1000	18.225346	85	35	2026-03-31 06:08:30.764329
3993	115	2026-02-27	5	4	1	t	800	16.492275	68	28	2026-03-31 06:08:30.767036
3994	115	2026-02-28	5	5	0	t	1000	21.233164	85	35	2026-03-31 06:08:30.769316
3995	115	2026-03-01	5	5	0	t	1000	18.0704	85	35	2026-03-31 06:08:30.771649
3996	115	2026-03-02	5	5	0	t	1000	20.522213	85	35	2026-03-31 06:08:30.773616
3997	115	2026-03-03	5	5	0	t	1000	20.272785	85	35	2026-03-31 06:08:30.775948
3998	115	2026-03-04	5	4	1	t	800	17.057463	68	28	2026-03-31 06:08:30.777778
3999	115	2026-03-05	5	5	0	t	1000	19.326366	85	35	2026-03-31 06:08:30.779997
4000	115	2026-03-06	5	5	0	t	1000	19.582178	85	35	2026-03-31 06:08:30.782159
4001	115	2026-03-07	5	4	1	t	800	14.749815	68	28	2026-03-31 06:08:30.784908
4002	115	2026-03-08	5	5	0	t	1000	20.024677	85	35	2026-03-31 06:08:30.787143
4003	115	2026-03-09	5	5	0	t	1000	20.564539	85	35	2026-03-31 06:08:30.789426
4004	115	2026-03-10	5	5	0	t	1000	19.82391	85	35	2026-03-31 06:08:30.792109
4005	115	2026-03-11	5	4	1	t	800	17.049355	68	28	2026-03-31 06:08:30.796414
4006	115	2026-03-12	5	5	0	t	1000	21.084997	85	35	2026-03-31 06:08:30.798944
4007	115	2026-03-13	5	5	0	t	1000	17.584423	85	35	2026-03-31 06:08:30.801633
4008	115	2026-03-14	5	4	1	t	800	16.977081	68	28	2026-03-31 06:08:30.804109
4009	115	2026-03-15	5	4	1	t	800	16.613577	68	28	2026-03-31 06:08:30.807533
4010	115	2026-03-16	5	5	0	t	1000	18.93212	85	35	2026-03-31 06:08:30.810134
4011	115	2026-03-17	5	5	0	t	1000	19.33412	85	35	2026-03-31 06:08:30.812335
4012	115	2026-03-18	5	4	1	t	800	16.339422	68	28	2026-03-31 06:08:30.814496
4013	115	2026-03-19	5	5	0	t	1000	18.62238	85	35	2026-03-31 06:08:30.816796
4014	115	2026-03-20	5	5	0	t	1000	21.192492	85	35	2026-03-31 06:08:30.81914
4015	115	2026-03-21	5	4	1	t	800	14.806313	68	28	2026-03-31 06:08:30.821015
4016	115	2026-03-22	5	5	0	t	1000	18.193436	85	35	2026-03-31 06:08:30.823545
4017	115	2026-03-23	5	5	0	t	1000	18.94315	85	35	2026-03-31 06:08:30.825819
4018	115	2026-03-24	5	4	1	t	800	15.332097	68	28	2026-03-31 06:08:30.829084
4019	115	2026-03-25	5	5	0	t	1000	18.400208	85	35	2026-03-31 06:08:30.83174
4020	115	2026-03-26	5	5	0	t	1000	20.650196	85	35	2026-03-31 06:08:30.833952
4021	115	2026-03-27	5	5	0	t	1000	20.4622	85	35	2026-03-31 06:08:30.836544
4022	115	2026-03-28	5	5	0	t	1000	20.224747	85	35	2026-03-31 06:08:30.839362
4023	115	2026-03-29	5	4	1	t	800	16.569956	68	28	2026-03-31 06:08:30.841105
4024	115	2026-03-30	5	5	0	t	1000	18.078	85	35	2026-03-31 06:08:30.842889
4025	115	2026-03-31	5	4	1	t	800	14.5131035	68	28	2026-03-31 06:08:30.845302
4026	116	2026-02-25	5	3	2	f	720	25.05862	60	24	2026-03-31 06:08:30.905123
4027	116	2026-02-26	5	2	3	f	480	17.665386	40	16	2026-03-31 06:08:30.907402
4028	116	2026-02-27	5	3	2	f	720	28.655613	60	24	2026-03-31 06:08:30.909218
4029	116	2026-02-28	5	3	2	f	720	28.429562	60	24	2026-03-31 06:08:30.911128
4030	116	2026-03-01	5	3	2	f	720	28.777882	60	24	2026-03-31 06:08:30.913347
4031	116	2026-03-02	5	3	2	f	720	25.30713	60	24	2026-03-31 06:08:30.915641
4032	116	2026-03-03	5	3	2	f	720	28.735785	60	24	2026-03-31 06:08:30.917861
4033	116	2026-03-04	5	3	2	f	720	28.780407	60	24	2026-03-31 06:08:30.920217
4034	116	2026-03-05	5	3	2	f	720	27.990253	60	24	2026-03-31 06:08:30.922095
4035	116	2026-03-06	5	3	2	f	720	25.31689	60	24	2026-03-31 06:08:30.924797
4036	116	2026-03-07	5	2	3	f	480	17.646706	40	16	2026-03-31 06:08:30.927079
4037	116	2026-03-08	5	3	2	f	720	25.502178	60	24	2026-03-31 06:08:30.929397
4038	116	2026-03-09	5	3	2	t	720	28.436235	60	24	2026-03-31 06:08:30.931861
4039	116	2026-03-10	5	3	2	t	720	26.842783	60	24	2026-03-31 06:08:30.93415
4040	116	2026-03-11	5	3	2	t	720	28.508415	60	24	2026-03-31 06:08:30.936454
4041	116	2026-03-12	5	3	2	t	720	28.05741	60	24	2026-03-31 06:08:30.938444
4042	116	2026-03-13	5	3	2	t	720	28.552202	60	24	2026-03-31 06:08:30.940615
4043	116	2026-03-14	5	2	3	t	480	18.814806	40	16	2026-03-31 06:08:30.943419
4044	116	2026-03-15	5	3	2	t	720	27.810316	60	24	2026-03-31 06:08:30.945301
4045	116	2026-03-16	5	3	2	t	720	26.571938	60	24	2026-03-31 06:08:30.947311
4046	116	2026-03-17	5	2	3	t	480	17.694218	40	16	2026-03-31 06:08:30.949914
4047	116	2026-03-18	5	3	2	t	720	28.125204	60	24	2026-03-31 06:08:30.952713
4048	116	2026-03-19	5	3	2	t	720	27.979336	60	24	2026-03-31 06:08:30.95517
4049	116	2026-03-20	5	3	2	t	720	28.890734	60	24	2026-03-31 06:08:30.957469
4050	116	2026-03-21	5	3	2	t	720	26.839777	60	24	2026-03-31 06:08:30.960169
4051	116	2026-03-22	5	3	2	t	720	26.227076	60	24	2026-03-31 06:08:30.962819
4052	116	2026-03-23	5	3	2	t	720	25.311262	60	24	2026-03-31 06:08:30.965214
4053	116	2026-03-24	5	3	2	t	720	27.716568	60	24	2026-03-31 06:08:30.9672
4054	116	2026-03-25	5	3	2	t	720	28.267752	60	24	2026-03-31 06:08:30.96905
4055	116	2026-03-26	5	3	2	t	720	26.540916	60	24	2026-03-31 06:08:30.97156
4056	116	2026-03-27	5	3	2	t	720	28.046715	60	24	2026-03-31 06:08:30.973958
4057	116	2026-03-28	5	3	2	t	720	26.576303	60	24	2026-03-31 06:08:30.976334
4058	116	2026-03-29	5	3	2	t	720	25.571024	60	24	2026-03-31 06:08:30.978222
4059	116	2026-03-30	5	3	2	t	720	26.293098	60	24	2026-03-31 06:08:30.980477
4060	116	2026-03-31	5	2	3	t	480	16.834595	40	16	2026-03-31 06:08:30.982752
4061	117	2026-02-25	5	4	1	f	1120	11.051709	96	36	2026-03-31 06:08:31.112356
4062	117	2026-02-26	5	4	1	f	1120	9.257244	96	36	2026-03-31 06:08:31.114962
4063	117	2026-02-27	5	4	1	f	1120	11.566648	96	36	2026-03-31 06:08:31.11769
4064	117	2026-02-28	5	4	1	t	1120	9.756552	96	36	2026-03-31 06:08:31.12026
4065	117	2026-03-01	5	4	1	t	1120	9.055232	96	36	2026-03-31 06:08:31.12226
4066	117	2026-03-02	5	4	1	t	1120	10.872355	96	36	2026-03-31 06:08:31.124688
4067	117	2026-03-03	5	4	1	t	1120	10.919792	96	36	2026-03-31 06:08:31.12721
4068	117	2026-03-04	5	4	1	t	1120	9.2729225	96	36	2026-03-31 06:08:31.13018
4069	117	2026-03-05	5	4	1	t	1120	10.963274	96	36	2026-03-31 06:08:31.132432
4070	117	2026-03-06	5	4	1	t	1120	11.071349	96	36	2026-03-31 06:08:31.135043
4071	117	2026-03-07	5	4	1	t	1120	10.827805	96	36	2026-03-31 06:08:31.137747
4072	117	2026-03-08	5	5	0	t	1400	12.754708	120	45	2026-03-31 06:08:31.140437
4073	117	2026-03-09	5	4	1	t	1120	9.39418	96	36	2026-03-31 06:08:31.142695
4074	117	2026-03-10	5	4	1	t	1120	10.445911	96	36	2026-03-31 06:08:31.145815
4075	117	2026-03-11	5	4	1	t	1120	9.849489	96	36	2026-03-31 06:08:31.14837
4076	117	2026-03-12	5	4	1	t	1120	10.160603	96	36	2026-03-31 06:08:31.151175
4077	117	2026-03-13	5	4	1	t	1120	8.092205	96	36	2026-03-31 06:08:31.153454
4078	117	2026-03-14	5	4	1	t	1120	10.155727	96	36	2026-03-31 06:08:31.155995
4079	117	2026-03-15	5	5	0	t	1400	12.418657	120	45	2026-03-31 06:08:31.157944
4080	117	2026-03-16	5	4	1	t	1120	9.70633	96	36	2026-03-31 06:08:31.160409
4081	117	2026-03-17	5	5	0	t	1400	12.320818	120	45	2026-03-31 06:08:31.162592
4082	117	2026-03-18	5	4	1	t	1120	11.416222	96	36	2026-03-31 06:08:31.165234
4083	117	2026-03-19	5	4	1	t	1120	8.108422	96	36	2026-03-31 06:08:31.167263
4084	117	2026-03-20	5	4	1	t	1120	8.814777	96	36	2026-03-31 06:08:31.169985
4085	117	2026-03-21	5	5	0	t	1400	13.504672	120	45	2026-03-31 06:08:31.172466
4086	117	2026-03-22	5	4	1	t	1120	10.598761	96	36	2026-03-31 06:08:31.175155
4087	117	2026-03-23	5	4	1	t	1120	7.846767	96	36	2026-03-31 06:08:31.17789
4088	117	2026-03-24	5	4	1	t	1120	9.596649	96	36	2026-03-31 06:08:31.180411
4089	117	2026-03-25	5	4	1	t	1120	11.745343	96	36	2026-03-31 06:08:31.182526
4090	117	2026-03-26	5	4	1	t	1120	8.224641	96	36	2026-03-31 06:08:31.185795
4091	117	2026-03-27	5	4	1	t	1120	9.346788	96	36	2026-03-31 06:08:31.187851
4092	117	2026-03-28	5	4	1	t	1120	9.107562	96	36	2026-03-31 06:08:31.19025
4093	117	2026-03-29	5	4	1	t	1120	10.454782	96	36	2026-03-31 06:08:31.192246
4094	117	2026-03-30	5	4	1	t	1120	9.416468	96	36	2026-03-31 06:08:31.19501
4095	117	2026-03-31	5	4	1	t	1120	8.965362	96	36	2026-03-31 06:08:31.1974
4096	118	2026-02-25	5	2	3	f	640	26.324015	54	20	2026-03-31 06:08:31.258559
4097	118	2026-02-26	5	2	3	f	640	25.866814	54	20	2026-03-31 06:08:31.260388
4098	118	2026-02-27	5	2	3	f	640	24.702682	54	20	2026-03-31 06:08:31.262744
4099	118	2026-02-28	5	2	3	f	640	26.946981	54	20	2026-03-31 06:08:31.264793
4100	118	2026-03-01	5	2	3	f	640	27.573513	54	20	2026-03-31 06:08:31.267747
4101	118	2026-03-02	5	2	3	f	640	25.638346	54	20	2026-03-31 06:08:31.270126
4102	118	2026-03-03	5	2	3	f	640	25.347113	54	20	2026-03-31 06:08:31.272574
4103	118	2026-03-04	5	2	3	f	640	27.322004	54	20	2026-03-31 06:08:31.274596
4104	118	2026-03-05	5	2	3	f	640	24.9618	54	20	2026-03-31 06:08:31.277166
4105	118	2026-03-06	5	2	3	f	640	27.671227	54	20	2026-03-31 06:08:31.279372
4106	118	2026-03-07	5	2	3	f	640	24.445627	54	20	2026-03-31 06:08:31.282143
4107	118	2026-03-08	5	2	3	f	640	24.462233	54	20	2026-03-31 06:08:31.284116
4108	118	2026-03-09	5	2	3	f	640	25.417665	54	20	2026-03-31 06:08:31.286577
4109	118	2026-03-10	5	2	3	f	640	25.757519	54	20	2026-03-31 06:08:31.288784
4110	118	2026-03-11	5	2	3	f	640	25.355501	54	20	2026-03-31 06:08:31.291122
4111	118	2026-03-12	5	2	3	f	640	26.469616	54	20	2026-03-31 06:08:31.293093
4112	118	2026-03-13	5	2	3	f	640	24.429611	54	20	2026-03-31 06:08:31.295451
4113	118	2026-03-14	5	2	3	f	640	27.609335	54	20	2026-03-31 06:08:31.297431
4114	118	2026-03-15	5	2	3	t	640	27.65074	54	20	2026-03-31 06:08:31.300467
4115	118	2026-03-16	5	2	3	t	640	27.47242	54	20	2026-03-31 06:08:31.302711
4116	118	2026-03-17	5	2	3	t	640	25.415976	54	20	2026-03-31 06:08:31.305319
4117	118	2026-03-18	5	2	3	t	640	27.413403	54	20	2026-03-31 06:08:31.307156
4118	118	2026-03-19	5	2	3	t	640	25.56858	54	20	2026-03-31 06:08:31.309554
4119	118	2026-03-20	5	2	3	t	640	24.571768	54	20	2026-03-31 06:08:31.312057
4120	118	2026-03-21	5	2	3	t	640	28.078175	54	20	2026-03-31 06:08:31.314573
4121	118	2026-03-22	5	2	3	t	640	26.484587	54	20	2026-03-31 06:08:31.31653
4122	118	2026-03-23	5	2	3	t	640	25.361761	54	20	2026-03-31 06:08:31.319087
4123	118	2026-03-24	5	2	3	t	640	25.458952	54	20	2026-03-31 06:08:31.321002
4124	118	2026-03-25	5	1	4	t	320	12.288151	27	10	2026-03-31 06:08:31.323335
4125	118	2026-03-26	5	2	3	t	640	27.953892	54	20	2026-03-31 06:08:31.325676
4126	118	2026-03-27	5	2	3	t	640	25.732323	54	20	2026-03-31 06:08:31.328155
4127	118	2026-03-28	5	2	3	t	640	27.448502	54	20	2026-03-31 06:08:31.33091
4128	118	2026-03-29	5	1	4	t	320	15.157998	27	10	2026-03-31 06:08:31.334172
4129	118	2026-03-30	5	2	3	t	640	26.005041	54	20	2026-03-31 06:08:31.336292
4130	118	2026-03-31	5	1	4	t	320	14.746352	27	10	2026-03-31 06:08:31.338876
4131	119	2026-02-25	5	4	1	f	960	11.75201	80	32	2026-03-31 06:08:31.401871
4132	119	2026-02-26	5	4	1	f	960	13.149458	80	32	2026-03-31 06:08:31.403792
4133	119	2026-02-27	5	4	1	f	960	12.120362	80	32	2026-03-31 06:08:31.406285
4134	119	2026-02-28	5	4	1	f	960	14.377989	80	32	2026-03-31 06:08:31.408731
4135	119	2026-03-01	5	4	1	t	960	10.918598	80	32	2026-03-31 06:08:31.411148
4136	119	2026-03-02	5	4	1	t	960	12.842814	80	32	2026-03-31 06:08:31.413142
4137	119	2026-03-03	5	3	2	t	720	9.129919	60	24	2026-03-31 06:08:31.41552
4138	119	2026-03-04	5	4	1	t	960	11.028062	80	32	2026-03-31 06:08:31.417386
4139	119	2026-03-05	5	4	1	t	960	10.888161	80	32	2026-03-31 06:08:31.419692
4140	119	2026-03-06	5	4	1	t	960	12.164382	80	32	2026-03-31 06:08:31.421567
4141	119	2026-03-07	5	4	1	t	960	12.323184	80	32	2026-03-31 06:08:31.424227
4142	119	2026-03-08	5	4	1	t	960	14.386114	80	32	2026-03-31 06:08:31.426678
4143	119	2026-03-09	5	4	1	t	960	14.483763	80	32	2026-03-31 06:08:31.429006
4144	119	2026-03-10	5	4	1	t	960	11.598712	80	32	2026-03-31 06:08:31.431078
4145	119	2026-03-11	5	4	1	t	960	10.844017	80	32	2026-03-31 06:08:31.433669
4146	119	2026-03-12	5	4	1	t	960	13.511861	80	32	2026-03-31 06:08:31.435645
4147	119	2026-03-13	5	4	1	t	960	10.818323	80	32	2026-03-31 06:08:31.438037
4148	119	2026-03-14	5	3	2	t	720	9.239907	60	24	2026-03-31 06:08:31.440615
4149	119	2026-03-15	5	4	1	t	960	12.067232	80	32	2026-03-31 06:08:31.443124
4150	119	2026-03-16	5	4	1	t	960	13.814561	80	32	2026-03-31 06:08:31.444965
4151	119	2026-03-17	5	4	1	t	960	14.383957	80	32	2026-03-31 06:08:31.447337
4152	119	2026-03-18	5	4	1	t	960	11.636934	80	32	2026-03-31 06:08:31.44925
4153	119	2026-03-19	5	4	1	t	960	13.721738	80	32	2026-03-31 06:08:31.451672
4154	119	2026-03-20	5	4	1	t	960	12.737657	80	32	2026-03-31 06:08:31.453927
4155	119	2026-03-21	5	4	1	t	960	13.037524	80	32	2026-03-31 06:08:31.456259
4156	119	2026-03-22	5	4	1	t	960	14.682964	80	32	2026-03-31 06:08:31.458467
4157	119	2026-03-23	5	4	1	t	960	14.494931	80	32	2026-03-31 06:08:31.460693
4158	119	2026-03-24	5	4	1	t	960	12.949927	80	32	2026-03-31 06:08:31.462883
4159	119	2026-03-25	5	4	1	t	960	12.253956	80	32	2026-03-31 06:08:31.465217
4160	119	2026-03-26	5	3	2	t	720	10.214067	60	24	2026-03-31 06:08:31.46778
4161	119	2026-03-27	5	4	1	t	960	10.87698	80	32	2026-03-31 06:08:31.470268
4162	119	2026-03-28	5	4	1	t	960	14.500126	80	32	2026-03-31 06:08:31.472584
4163	119	2026-03-29	5	4	1	t	960	13.10634	80	32	2026-03-31 06:08:31.475082
4164	119	2026-03-30	5	4	1	t	960	12.310422	80	32	2026-03-31 06:08:31.476987
4165	119	2026-03-31	5	4	1	t	960	13.179474	80	32	2026-03-31 06:08:31.479274
4166	120	2026-02-25	5	3	2	f	600	10.833791	51	21	2026-03-31 06:08:31.543817
4167	120	2026-02-26	5	3	2	f	600	13.222444	51	21	2026-03-31 06:08:31.546301
4168	120	2026-02-27	5	3	2	f	600	11.143124	51	21	2026-03-31 06:08:31.548907
4169	120	2026-02-28	5	3	2	f	600	12.088591	51	21	2026-03-31 06:08:31.551578
4170	120	2026-03-01	5	4	1	f	800	17.15268	68	28	2026-03-31 06:08:31.554658
4171	120	2026-03-02	5	4	1	f	800	15.174099	68	28	2026-03-31 06:08:31.55746
4172	120	2026-03-03	5	3	2	f	600	10.321826	51	21	2026-03-31 06:08:31.560726
4173	120	2026-03-04	5	3	2	f	600	11.220634	51	21	2026-03-31 06:08:31.565478
4174	120	2026-03-05	5	4	1	f	800	17.262423	68	28	2026-03-31 06:08:31.568615
4175	120	2026-03-06	5	3	2	t	600	12.538399	51	21	2026-03-31 06:08:31.572464
4176	120	2026-03-07	5	3	2	t	600	12.197752	51	21	2026-03-31 06:08:31.576489
4177	120	2026-03-08	5	4	1	t	800	15.380874	68	28	2026-03-31 06:08:31.580258
4178	120	2026-03-09	5	3	2	t	600	10.995451	51	21	2026-03-31 06:08:31.582274
4179	120	2026-03-10	5	3	2	t	600	11.672769	51	21	2026-03-31 06:08:31.584751
4180	120	2026-03-11	5	3	2	t	600	13.570725	51	21	2026-03-31 06:08:31.587379
4181	120	2026-03-12	5	3	2	t	600	13.287077	51	21	2026-03-31 06:08:31.590046
4182	120	2026-03-13	5	4	1	t	800	16.129082	68	28	2026-03-31 06:08:31.592446
4183	120	2026-03-14	5	4	1	t	800	14.563984	68	28	2026-03-31 06:08:31.594767
4184	120	2026-03-15	5	3	2	t	600	12.76005	51	21	2026-03-31 06:08:31.596654
4185	120	2026-03-16	5	3	2	t	600	11.246524	51	21	2026-03-31 06:08:31.599974
4186	120	2026-03-17	5	3	2	t	600	12.045413	51	21	2026-03-31 06:08:31.602351
4187	120	2026-03-18	5	3	2	t	600	13.043799	51	21	2026-03-31 06:08:31.604933
4188	120	2026-03-19	5	4	1	t	800	17.681757	68	28	2026-03-31 06:08:31.607283
4189	120	2026-03-20	5	4	1	t	800	17.516682	68	28	2026-03-31 06:08:31.609619
4190	120	2026-03-21	5	3	2	t	600	12.453449	51	21	2026-03-31 06:08:31.611622
4191	120	2026-03-22	5	4	1	t	800	15.9028635	68	28	2026-03-31 06:08:31.614145
4192	120	2026-03-23	5	3	2	t	600	11.643868	51	21	2026-03-31 06:08:31.616218
4193	120	2026-03-24	5	3	2	t	600	10.087579	51	21	2026-03-31 06:08:31.618844
4194	120	2026-03-25	5	3	2	t	600	12.803762	51	21	2026-03-31 06:08:31.62118
4195	120	2026-03-26	5	3	2	t	600	10.094846	51	21	2026-03-31 06:08:31.623498
4196	120	2026-03-27	5	3	2	t	600	12.435316	51	21	2026-03-31 06:08:31.625793
4197	120	2026-03-28	5	3	2	t	600	13.202653	51	21	2026-03-31 06:08:31.628605
4198	120	2026-03-29	5	3	2	t	600	12.510056	51	21	2026-03-31 06:08:31.631016
4199	120	2026-03-30	5	4	1	t	800	17.718462	68	28	2026-03-31 06:08:31.633604
4200	120	2026-03-31	5	3	2	t	600	10.68776	51	21	2026-03-31 06:08:31.63563
4201	121	2026-02-25	5	4	1	t	1120	11.731741	96	36	2026-03-31 06:08:31.699663
4202	121	2026-02-26	5	4	1	t	1120	7.958617	96	36	2026-03-31 06:08:31.702094
4203	121	2026-02-27	5	5	0	t	1400	12.659379	120	45	2026-03-31 06:08:31.703992
4204	121	2026-02-28	5	5	0	t	1400	10.736967	120	45	2026-03-31 06:08:31.706513
4205	121	2026-03-01	5	4	1	t	1120	8.143078	96	36	2026-03-31 06:08:31.708507
4206	121	2026-03-02	5	5	0	t	1400	12.92263	120	45	2026-03-31 06:08:31.710643
4207	121	2026-03-03	5	5	0	t	1400	10.054653	120	45	2026-03-31 06:08:31.713109
4208	121	2026-03-04	5	4	1	t	1120	8.8761	96	36	2026-03-31 06:08:31.715124
4209	121	2026-03-05	5	4	1	t	1120	11.632248	96	36	2026-03-31 06:08:31.717077
4210	121	2026-03-06	5	5	0	t	1400	10.196833	120	45	2026-03-31 06:08:31.719327
4211	121	2026-03-07	5	5	0	t	1400	11.696466	120	45	2026-03-31 06:08:31.721177
4212	121	2026-03-08	5	4	1	t	1120	11.467554	96	36	2026-03-31 06:08:31.723355
4213	121	2026-03-09	5	4	1	t	1120	10.359936	96	36	2026-03-31 06:08:31.726326
4214	121	2026-03-10	5	4	1	t	1120	8.277259	96	36	2026-03-31 06:08:31.728695
4215	121	2026-03-11	5	5	0	t	1400	10.990445	120	45	2026-03-31 06:08:31.730949
4216	121	2026-03-12	5	4	1	t	1120	10.722885	96	36	2026-03-31 06:08:31.733368
4217	121	2026-03-13	5	5	0	t	1400	12.827322	120	45	2026-03-31 06:08:31.735267
4218	121	2026-03-14	5	4	1	t	1120	10.255527	96	36	2026-03-31 06:08:31.737729
4219	121	2026-03-15	5	5	0	t	1400	11.38024	120	45	2026-03-31 06:08:31.739714
4220	121	2026-03-16	5	4	1	t	1120	11.706506	96	36	2026-03-31 06:08:31.742135
4221	121	2026-03-17	5	5	0	t	1400	12.438212	120	45	2026-03-31 06:08:31.744521
4222	121	2026-03-18	5	4	1	t	1120	9.722789	96	36	2026-03-31 06:08:31.746721
4223	121	2026-03-19	5	4	1	t	1120	10.139696	96	36	2026-03-31 06:08:31.749025
4224	121	2026-03-20	5	5	0	t	1400	12.9895935	120	45	2026-03-31 06:08:31.751253
4225	121	2026-03-21	5	5	0	t	1400	12.783896	120	45	2026-03-31 06:08:31.754137
4226	121	2026-03-22	5	4	1	t	1120	11.257779	96	36	2026-03-31 06:08:31.756707
4227	121	2026-03-23	5	4	1	t	1120	10.880186	96	36	2026-03-31 06:08:31.759151
4228	121	2026-03-24	5	4	1	t	1120	8.26547	96	36	2026-03-31 06:08:31.76123
4229	121	2026-03-25	5	4	1	t	1120	10.932844	96	36	2026-03-31 06:08:31.763529
4230	121	2026-03-26	5	4	1	t	1120	9.208233	96	36	2026-03-31 06:08:31.765868
4231	121	2026-03-27	5	5	0	t	1400	13.584905	120	45	2026-03-31 06:08:31.767781
4232	121	2026-03-28	5	5	0	t	1400	10.818454	120	45	2026-03-31 06:08:31.770309
4233	121	2026-03-29	5	5	0	t	1400	11.577427	120	45	2026-03-31 06:08:31.772695
4234	121	2026-03-30	5	4	1	t	1120	11.268395	96	36	2026-03-31 06:08:31.774927
4235	121	2026-03-31	5	5	0	t	1400	12.972563	120	45	2026-03-31 06:08:31.776739
4236	122	2026-02-25	5	2	3	f	640	21.088068	54	20	2026-03-31 06:08:31.836885
4237	122	2026-02-26	5	3	2	f	960	27.719845	81	30	2026-03-31 06:08:31.839345
4238	122	2026-02-27	5	3	2	f	960	31.260796	81	30	2026-03-31 06:08:31.841283
4239	122	2026-02-28	5	3	2	f	960	28.874989	81	30	2026-03-31 06:08:31.843091
4240	122	2026-03-01	5	2	3	f	640	20.710907	54	20	2026-03-31 06:08:31.84537
4241	122	2026-03-02	5	3	2	f	960	31.25917	81	30	2026-03-31 06:08:31.847145
4242	122	2026-03-03	5	3	2	f	960	29.325178	81	30	2026-03-31 06:08:31.849873
4243	122	2026-03-04	5	2	3	f	640	19.807863	54	20	2026-03-31 06:08:31.851673
4244	122	2026-03-05	5	2	3	f	640	20.586937	54	20	2026-03-31 06:08:31.854256
4245	122	2026-03-06	5	2	3	f	640	19.94605	54	20	2026-03-31 06:08:31.856317
4246	122	2026-03-07	5	2	3	f	640	20.40569	54	20	2026-03-31 06:08:31.858665
4247	122	2026-03-08	5	2	3	f	640	21.221636	54	20	2026-03-31 06:08:31.861118
4248	122	2026-03-09	5	2	3	f	640	21.986963	54	20	2026-03-31 06:08:31.863171
4249	122	2026-03-10	5	3	2	f	960	29.694778	81	30	2026-03-31 06:08:31.864979
4250	122	2026-03-11	5	2	3	t	640	18.358418	54	20	2026-03-31 06:08:31.867297
4251	122	2026-03-12	5	3	2	t	960	31.58345	81	30	2026-03-31 06:08:31.869204
4252	122	2026-03-13	5	2	3	t	640	21.939478	54	20	2026-03-31 06:08:31.871243
4253	122	2026-03-14	5	2	3	t	640	18.815987	54	20	2026-03-31 06:08:31.87326
4254	122	2026-03-15	5	2	3	t	640	21.413702	54	20	2026-03-31 06:08:31.875803
4255	122	2026-03-16	5	2	3	t	640	18.571543	54	20	2026-03-31 06:08:31.878088
4256	122	2026-03-17	5	2	3	t	640	18.744108	54	20	2026-03-31 06:08:31.880562
4257	122	2026-03-18	5	3	2	t	960	29.05096	81	30	2026-03-31 06:08:31.882993
4258	122	2026-03-19	5	3	2	t	960	30.972101	81	30	2026-03-31 06:08:31.885219
4259	122	2026-03-20	5	2	3	t	640	20.989086	54	20	2026-03-31 06:08:31.88747
4260	122	2026-03-21	5	2	3	t	640	21.00532	54	20	2026-03-31 06:08:31.890277
4261	122	2026-03-22	5	3	2	t	960	30.950949	81	30	2026-03-31 06:08:31.892618
4262	122	2026-03-23	5	2	3	t	640	20.56291	54	20	2026-03-31 06:08:31.895104
4263	122	2026-03-24	5	3	2	t	960	31.017769	81	30	2026-03-31 06:08:31.897616
4264	122	2026-03-25	5	2	3	t	640	21.960604	54	20	2026-03-31 06:08:31.90034
4265	122	2026-03-26	5	2	3	t	640	19.65039	54	20	2026-03-31 06:08:31.902675
4266	122	2026-03-27	5	2	3	t	640	21.880474	54	20	2026-03-31 06:08:31.905064
4267	122	2026-03-28	5	3	2	t	960	28.102324	81	30	2026-03-31 06:08:31.906874
4268	122	2026-03-29	5	3	2	t	960	29.452452	81	30	2026-03-31 06:08:31.909278
4269	122	2026-03-30	5	2	3	t	640	18.58431	54	20	2026-03-31 06:08:31.911162
4270	122	2026-03-31	5	3	2	t	960	30.589447	81	30	2026-03-31 06:08:31.913601
4271	123	2026-02-25	5	4	1	f	960	14.304407	80	32	2026-03-31 06:08:31.974403
4272	123	2026-02-26	5	4	1	f	960	12.74862	80	32	2026-03-31 06:08:31.976714
4273	123	2026-02-27	5	4	1	f	960	12.96471	80	32	2026-03-31 06:08:31.978923
4274	123	2026-02-28	5	4	1	f	960	13.38578	80	32	2026-03-31 06:08:31.982339
4275	123	2026-03-01	5	4	1	f	960	10.946362	80	32	2026-03-31 06:08:31.984267
4276	123	2026-03-02	5	4	1	f	960	12.700566	80	32	2026-03-31 06:08:31.986564
4277	123	2026-03-03	5	4	1	t	960	10.983821	80	32	2026-03-31 06:08:31.989032
4278	123	2026-03-04	5	4	1	t	960	11.053653	80	32	2026-03-31 06:08:31.991016
4279	123	2026-03-05	5	4	1	t	960	13.612469	80	32	2026-03-31 06:08:31.993041
4280	123	2026-03-06	5	3	2	t	720	10.768939	60	24	2026-03-31 06:08:31.995584
4281	123	2026-03-07	5	3	2	t	720	8.4239025	60	24	2026-03-31 06:08:31.99792
4282	123	2026-03-08	5	4	1	t	960	11.791294	80	32	2026-03-31 06:08:32.000312
4283	123	2026-03-09	5	4	1	t	960	11.78896	80	32	2026-03-31 06:08:32.002275
4284	123	2026-03-10	5	3	2	t	720	8.019015	60	24	2026-03-31 06:08:32.004664
4285	123	2026-03-11	5	4	1	t	960	12.246736	80	32	2026-03-31 06:08:32.007104
4286	123	2026-03-12	5	4	1	t	960	14.160934	80	32	2026-03-31 06:08:32.00921
4287	123	2026-03-13	5	3	2	t	720	10.770243	60	24	2026-03-31 06:08:32.011178
4288	123	2026-03-14	5	4	1	t	960	13.479007	80	32	2026-03-31 06:08:32.01358
4289	123	2026-03-15	5	4	1	t	960	11.927832	80	32	2026-03-31 06:08:32.016794
4290	123	2026-03-16	5	4	1	t	960	12.152792	80	32	2026-03-31 06:08:32.019264
4291	123	2026-03-17	5	3	2	t	720	11.619613	60	24	2026-03-31 06:08:32.021099
4292	123	2026-03-18	5	4	1	t	960	12.549976	80	32	2026-03-31 06:08:32.023306
4293	123	2026-03-19	5	4	1	t	960	13.961312	80	32	2026-03-31 06:08:32.025546
4294	123	2026-03-20	5	3	2	t	720	9.586318	60	24	2026-03-31 06:08:32.027935
4295	123	2026-03-21	5	4	1	t	960	13.711076	80	32	2026-03-31 06:08:32.030228
4296	123	2026-03-22	5	3	2	t	720	11.567447	60	24	2026-03-31 06:08:32.032911
4297	123	2026-03-23	5	4	1	t	960	11.922746	80	32	2026-03-31 06:08:32.035034
4298	123	2026-03-24	5	3	2	t	720	11.283987	60	24	2026-03-31 06:08:32.037491
4299	123	2026-03-25	5	3	2	t	720	9.455328	60	24	2026-03-31 06:08:32.040056
4300	123	2026-03-26	5	3	2	t	720	8.91538	60	24	2026-03-31 06:08:32.042847
4301	123	2026-03-27	5	4	1	t	960	11.921246	80	32	2026-03-31 06:08:32.044794
4302	123	2026-03-28	5	4	1	t	960	12.2995205	80	32	2026-03-31 06:08:32.047128
4303	123	2026-03-29	5	3	2	t	720	10.397545	60	24	2026-03-31 06:08:32.04933
4304	123	2026-03-30	5	3	2	t	720	9.215625	60	24	2026-03-31 06:08:32.051491
4305	123	2026-03-31	5	3	2	t	720	9.162557	60	24	2026-03-31 06:08:32.053941
4306	124	2026-02-25	5	4	1	f	800	17.73874	68	28	2026-03-31 06:08:32.114775
4307	124	2026-02-26	5	4	1	t	800	15.434397	68	28	2026-03-31 06:08:32.1167
4308	124	2026-02-27	5	4	1	t	800	16.7658	68	28	2026-03-31 06:08:32.119125
4309	124	2026-02-28	5	5	0	t	1000	17.671614	85	35	2026-03-31 06:08:32.121519
4310	124	2026-03-01	5	4	1	t	800	15.979752	68	28	2026-03-31 06:08:32.124272
4311	124	2026-03-02	5	5	0	t	1000	19.030773	85	35	2026-03-31 06:08:32.126945
4312	124	2026-03-03	5	4	1	t	800	15.489988	68	28	2026-03-31 06:08:32.129299
4313	124	2026-03-04	5	4	1	t	800	15.218437	68	28	2026-03-31 06:08:32.131796
4314	124	2026-03-05	5	5	0	t	1000	18.137215	85	35	2026-03-31 06:08:32.134821
4315	124	2026-03-06	5	5	0	t	1000	20.543371	85	35	2026-03-31 06:08:32.137369
4316	124	2026-03-07	5	5	0	t	1000	20.873901	85	35	2026-03-31 06:08:32.139963
4317	124	2026-03-08	5	4	1	t	800	14.010262	68	28	2026-03-31 06:08:32.142077
4318	124	2026-03-09	5	4	1	t	800	16.539942	68	28	2026-03-31 06:08:32.144355
4319	124	2026-03-10	5	4	1	t	800	14.993587	68	28	2026-03-31 06:08:32.147017
4320	124	2026-03-11	5	5	0	t	1000	17.803297	85	35	2026-03-31 06:08:32.149524
4321	124	2026-03-12	5	5	0	t	1000	20.483202	85	35	2026-03-31 06:08:32.151904
4322	124	2026-03-13	5	4	1	t	800	15.277762	68	28	2026-03-31 06:08:32.154799
4323	124	2026-03-14	5	4	1	t	800	15.615201	68	28	2026-03-31 06:08:32.156631
4324	124	2026-03-15	5	4	1	t	800	13.818097	68	28	2026-03-31 06:08:32.158982
4325	124	2026-03-16	5	4	1	t	800	14.151997	68	28	2026-03-31 06:08:32.161032
4326	124	2026-03-17	5	5	0	t	1000	20.954065	85	35	2026-03-31 06:08:32.163116
4327	124	2026-03-18	5	4	1	t	800	16.781488	68	28	2026-03-31 06:08:32.165315
4328	124	2026-03-19	5	4	1	t	800	15.585124	68	28	2026-03-31 06:08:32.167738
4329	124	2026-03-20	5	4	1	t	800	17.355324	68	28	2026-03-31 06:08:32.170255
4330	124	2026-03-21	5	4	1	t	800	14.470676	68	28	2026-03-31 06:08:32.172182
4331	124	2026-03-22	5	5	0	t	1000	19.275475	85	35	2026-03-31 06:08:32.174156
4332	124	2026-03-23	5	5	0	t	1000	18.18758	85	35	2026-03-31 06:08:32.176574
4333	124	2026-03-24	5	4	1	t	800	16.66026	68	28	2026-03-31 06:08:32.179017
4334	124	2026-03-25	5	4	1	t	800	16.636147	68	28	2026-03-31 06:08:32.181426
4335	124	2026-03-26	5	4	1	t	800	14.8048315	68	28	2026-03-31 06:08:32.183323
4336	124	2026-03-27	5	4	1	t	800	14.325566	68	28	2026-03-31 06:08:32.18527
4337	124	2026-03-28	5	4	1	t	800	14.05757	68	28	2026-03-31 06:08:32.187143
4338	124	2026-03-29	5	5	0	t	1000	20.519318	85	35	2026-03-31 06:08:32.189968
4339	124	2026-03-30	5	4	1	t	800	17.575314	68	28	2026-03-31 06:08:32.191838
4340	124	2026-03-31	5	5	0	t	1000	20.17879	85	35	2026-03-31 06:08:32.194225
4341	125	2026-02-25	5	2	3	f	560	19.540735	48	18	2026-03-31 06:08:32.254483
4342	125	2026-02-26	5	2	3	f	560	22.140982	48	18	2026-03-31 06:08:32.257688
4343	125	2026-02-27	5	2	3	f	560	19.702227	48	18	2026-03-31 06:08:32.259731
4344	125	2026-02-28	5	2	3	f	560	21.264952	48	18	2026-03-31 06:08:32.262367
4345	125	2026-03-01	5	2	3	f	560	21.559223	48	18	2026-03-31 06:08:32.264427
4346	125	2026-03-02	5	1	4	f	280	10.04754	24	9	2026-03-31 06:08:32.26699
4347	125	2026-03-03	5	1	4	f	280	10.7719145	24	9	2026-03-31 06:08:32.268808
4348	125	2026-03-04	5	1	4	f	280	12.393118	24	9	2026-03-31 06:08:32.270952
4349	125	2026-03-05	5	2	3	f	560	19.91324	48	18	2026-03-31 06:08:32.27308
4350	125	2026-03-06	5	2	3	f	560	22.984186	48	18	2026-03-31 06:08:32.275522
4351	125	2026-03-07	5	2	3	f	560	20.196247	48	18	2026-03-31 06:08:32.277547
4352	125	2026-03-08	5	2	3	f	560	21.275158	48	18	2026-03-31 06:08:32.280054
4353	125	2026-03-09	5	2	3	f	560	19.505526	48	18	2026-03-31 06:08:32.28214
4354	125	2026-03-10	5	1	4	f	280	9.205268	24	9	2026-03-31 06:08:32.284256
4355	125	2026-03-11	5	1	4	f	280	12.864325	24	9	2026-03-31 06:08:32.286239
4356	125	2026-03-12	5	2	3	f	560	20.736584	48	18	2026-03-31 06:08:32.288731
4357	125	2026-03-13	5	2	3	f	560	23.203936	48	18	2026-03-31 06:08:32.290922
4358	125	2026-03-14	5	2	3	f	560	21.178812	48	18	2026-03-31 06:08:32.293707
4359	125	2026-03-15	5	1	4	f	280	12.95435	24	9	2026-03-31 06:08:32.295997
4360	125	2026-03-16	5	2	3	t	560	22.990858	48	18	2026-03-31 06:08:32.298731
4361	125	2026-03-17	5	2	3	t	560	19.723795	48	18	2026-03-31 06:08:32.301039
4362	125	2026-03-18	5	2	3	t	560	23.157541	48	18	2026-03-31 06:08:32.303138
4363	125	2026-03-19	5	2	3	t	560	19.65033	48	18	2026-03-31 06:08:32.305572
4364	125	2026-03-20	5	2	3	t	560	21.14846	48	18	2026-03-31 06:08:32.307975
4365	125	2026-03-21	5	1	4	t	280	10.26615	24	9	2026-03-31 06:08:32.31027
4366	125	2026-03-22	5	1	4	t	280	12.79095	24	9	2026-03-31 06:08:32.312971
4367	125	2026-03-23	5	2	3	t	560	22.88942	48	18	2026-03-31 06:08:32.315395
4368	125	2026-03-24	5	2	3	t	560	21.895445	48	18	2026-03-31 06:08:32.317683
4369	125	2026-03-25	5	2	3	t	560	21.00071	48	18	2026-03-31 06:08:32.322216
4370	125	2026-03-26	5	2	3	t	560	21.529171	48	18	2026-03-31 06:08:32.325455
4371	125	2026-03-27	5	1	4	t	280	11.275501	24	9	2026-03-31 06:08:32.327577
4372	125	2026-03-28	5	2	3	t	560	21.70847	48	18	2026-03-31 06:08:32.330314
4373	125	2026-03-29	5	2	3	t	560	20.13929	48	18	2026-03-31 06:08:32.332613
4374	125	2026-03-30	5	2	3	t	560	20.575182	48	18	2026-03-31 06:08:32.335482
4375	125	2026-03-31	5	2	3	t	560	22.908535	48	18	2026-03-31 06:08:32.337572
4376	126	2026-02-25	5	4	1	f	1280	13.2641115	108	40	2026-03-31 06:08:32.401141
4377	126	2026-02-26	5	4	1	f	1280	12.491976	108	40	2026-03-31 06:08:32.403249
4378	126	2026-02-27	5	4	1	f	1280	12.404865	108	40	2026-03-31 06:08:32.405916
4379	126	2026-02-28	5	4	1	t	1280	13.819174	108	40	2026-03-31 06:08:32.407961
4380	126	2026-03-01	5	4	1	t	1280	11.74724	108	40	2026-03-31 06:08:32.411058
4381	126	2026-03-02	5	4	1	t	1280	13.643083	108	40	2026-03-31 06:08:32.413065
4382	126	2026-03-03	5	4	1	t	1280	12.110767	108	40	2026-03-31 06:08:32.415242
4383	126	2026-03-04	5	4	1	t	1280	12.015219	108	40	2026-03-31 06:08:32.41718
4384	126	2026-03-05	5	4	1	t	1280	11.238991	108	40	2026-03-31 06:08:32.419362
4385	126	2026-03-06	5	4	1	t	1280	12.120971	108	40	2026-03-31 06:08:32.421234
4386	126	2026-03-07	5	4	1	t	1280	11.298025	108	40	2026-03-31 06:08:32.423671
4387	126	2026-03-08	5	4	1	t	1280	13.198677	108	40	2026-03-31 06:08:32.42593
4388	126	2026-03-09	5	4	1	t	1280	12.73877	108	40	2026-03-31 06:08:32.428285
4389	126	2026-03-10	5	4	1	t	1280	13.777204	108	40	2026-03-31 06:08:32.430581
4390	126	2026-03-11	5	4	1	t	1280	14.262551	108	40	2026-03-31 06:08:32.433118
4391	126	2026-03-12	5	4	1	t	1280	13.452383	108	40	2026-03-31 06:08:32.435529
4392	126	2026-03-13	5	4	1	t	1280	12.353008	108	40	2026-03-31 06:08:32.437735
4393	126	2026-03-14	5	4	1	t	1280	12.024084	108	40	2026-03-31 06:08:32.440458
4394	126	2026-03-15	5	4	1	t	1280	13.61522	108	40	2026-03-31 06:08:32.443563
4395	126	2026-03-16	5	4	1	t	1280	13.180508	108	40	2026-03-31 06:08:32.44554
4396	126	2026-03-17	5	4	1	t	1280	10.895396	108	40	2026-03-31 06:08:32.447613
4397	126	2026-03-18	5	4	1	t	1280	11.85757	108	40	2026-03-31 06:08:32.449975
4398	126	2026-03-19	5	4	1	t	1280	11.010074	108	40	2026-03-31 06:08:32.452247
4399	126	2026-03-20	5	4	1	t	1280	13.541059	108	40	2026-03-31 06:08:32.454258
4400	126	2026-03-21	5	4	1	t	1280	14.290865	108	40	2026-03-31 06:08:32.456325
4401	126	2026-03-22	5	4	1	t	1280	12.969945	108	40	2026-03-31 06:08:32.458994
4402	126	2026-03-23	5	4	1	t	1280	13.200246	108	40	2026-03-31 06:08:32.461726
4403	126	2026-03-24	5	4	1	t	1280	11.471329	108	40	2026-03-31 06:08:32.464542
4404	126	2026-03-25	5	4	1	t	1280	11.143886	108	40	2026-03-31 06:08:32.466861
4405	126	2026-03-26	5	4	1	t	1280	11.260842	108	40	2026-03-31 06:08:32.469337
4406	126	2026-03-27	5	4	1	t	1280	11.559721	108	40	2026-03-31 06:08:32.471971
4407	126	2026-03-28	5	4	1	t	1280	13.871437	108	40	2026-03-31 06:08:32.474458
4408	126	2026-03-29	5	4	1	t	1280	14.339336	108	40	2026-03-31 06:08:32.47738
4409	126	2026-03-30	5	4	1	t	1280	14.339913	108	40	2026-03-31 06:08:32.47988
4410	126	2026-03-31	5	4	1	t	1280	14.734963	108	40	2026-03-31 06:08:32.482074
4411	127	2026-02-25	5	3	2	f	600	30.771011	51	21	2026-03-31 06:08:32.546525
4412	127	2026-02-26	5	3	2	f	600	29.176264	51	21	2026-03-31 06:08:32.548881
4413	127	2026-02-27	5	3	2	f	600	30.039991	51	21	2026-03-31 06:08:32.550836
4414	127	2026-02-28	5	3	2	f	600	29.618446	51	21	2026-03-31 06:08:32.553592
4415	127	2026-03-01	5	3	2	f	600	32.570496	51	21	2026-03-31 06:08:32.555594
4416	127	2026-03-02	5	3	2	f	600	30.609564	51	21	2026-03-31 06:08:32.558105
4417	127	2026-03-03	5	3	2	f	600	31.546764	51	21	2026-03-31 06:08:32.560474
4418	127	2026-03-04	5	3	2	f	600	30.896141	51	21	2026-03-31 06:08:32.562639
4419	127	2026-03-05	5	3	2	f	600	30.985584	51	21	2026-03-31 06:08:32.564589
4420	127	2026-03-06	5	3	2	f	600	31.24498	51	21	2026-03-31 06:08:32.566775
4421	127	2026-03-07	5	3	2	t	600	31.89044	51	21	2026-03-31 06:08:32.568973
4422	127	2026-03-08	5	3	2	t	600	30.811047	51	21	2026-03-31 06:08:32.571957
4423	127	2026-03-09	5	3	2	t	600	31.37794	51	21	2026-03-31 06:08:32.574266
4424	127	2026-03-10	5	3	2	t	600	31.843811	51	21	2026-03-31 06:08:32.576773
4425	127	2026-03-11	5	3	2	t	600	31.824348	51	21	2026-03-31 06:08:32.579272
4426	127	2026-03-12	5	3	2	t	600	29.579494	51	21	2026-03-31 06:08:32.581339
4427	127	2026-03-13	5	3	2	t	600	29.797684	51	21	2026-03-31 06:08:32.583472
4428	127	2026-03-14	5	3	2	t	600	29.067072	51	21	2026-03-31 06:08:32.585659
4429	127	2026-03-15	5	3	2	t	600	28.90962	51	21	2026-03-31 06:08:32.588387
4430	127	2026-03-16	5	3	2	t	600	32.714584	51	21	2026-03-31 06:08:32.590537
4431	127	2026-03-17	5	3	2	t	600	29.13199	51	21	2026-03-31 06:08:32.592989
4432	127	2026-03-18	5	3	2	t	600	30.022131	51	21	2026-03-31 06:08:32.596317
4433	127	2026-03-19	5	3	2	t	600	28.954695	51	21	2026-03-31 06:08:32.598365
4434	127	2026-03-20	5	3	2	t	600	32.286514	51	21	2026-03-31 06:08:32.600884
4435	127	2026-03-21	5	3	2	t	600	31.04003	51	21	2026-03-31 06:08:32.602842
4436	127	2026-03-22	5	3	2	t	600	32.32661	51	21	2026-03-31 06:08:32.605793
4437	127	2026-03-23	5	3	2	t	600	31.557106	51	21	2026-03-31 06:08:32.608393
4438	127	2026-03-24	5	3	2	t	600	30.075195	51	21	2026-03-31 06:08:32.611407
4439	127	2026-03-25	5	3	2	t	600	29.225565	51	21	2026-03-31 06:08:32.614457
4440	127	2026-03-26	5	3	2	t	600	31.405615	51	21	2026-03-31 06:08:32.617586
4441	127	2026-03-27	5	3	2	t	600	29.831099	51	21	2026-03-31 06:08:32.620137
4442	127	2026-03-28	5	3	2	t	600	30.450365	51	21	2026-03-31 06:08:32.62281
4443	127	2026-03-29	5	3	2	t	600	31.4793	51	21	2026-03-31 06:08:32.625527
4444	127	2026-03-30	5	3	2	t	600	30.822514	51	21	2026-03-31 06:08:32.628257
4445	127	2026-03-31	5	3	2	t	600	30.043774	51	21	2026-03-31 06:08:32.630897
4446	128	2026-02-25	5	3	2	f	720	11.086907	60	24	2026-03-31 06:08:32.703207
4447	128	2026-02-26	5	4	1	f	960	14.713386	80	32	2026-03-31 06:08:32.705378
4448	128	2026-02-27	5	4	1	f	960	11.32109	80	32	2026-03-31 06:08:32.707746
4449	128	2026-02-28	5	3	2	f	720	11.327873	60	24	2026-03-31 06:08:32.710289
4450	128	2026-03-01	5	4	1	f	960	11.961087	80	32	2026-03-31 06:08:32.713094
4451	128	2026-03-02	5	4	1	t	960	14.790936	80	32	2026-03-31 06:08:32.715584
4452	128	2026-03-03	5	4	1	t	960	14.34299	80	32	2026-03-31 06:08:32.718074
4453	128	2026-03-04	5	4	1	t	960	13.4745865	80	32	2026-03-31 06:08:32.72048
4454	128	2026-03-05	5	4	1	t	960	12.134731	80	32	2026-03-31 06:08:32.722752
4455	128	2026-03-06	5	4	1	t	960	11.561497	80	32	2026-03-31 06:08:32.7285
4456	128	2026-03-07	5	4	1	t	960	11.40234	80	32	2026-03-31 06:08:32.73101
4457	128	2026-03-08	5	4	1	t	960	12.172156	80	32	2026-03-31 06:08:32.732961
4458	128	2026-03-09	5	4	1	t	960	11.1452	80	32	2026-03-31 06:08:32.735389
4459	128	2026-03-10	5	4	1	t	960	11.923621	80	32	2026-03-31 06:08:32.73776
4460	128	2026-03-11	5	3	2	t	720	9.277934	60	24	2026-03-31 06:08:32.740353
4461	128	2026-03-12	5	4	1	t	960	13.26124	80	32	2026-03-31 06:08:32.742259
4462	128	2026-03-13	5	4	1	t	960	11.7813	80	32	2026-03-31 06:08:32.744297
4463	128	2026-03-14	5	3	2	t	720	10.985892	60	24	2026-03-31 06:08:32.746318
4464	128	2026-03-15	5	4	1	t	960	14.362787	80	32	2026-03-31 06:08:32.749132
4465	128	2026-03-16	5	4	1	t	960	14.558056	80	32	2026-03-31 06:08:32.751499
4466	128	2026-03-17	5	4	1	t	960	14.274715	80	32	2026-03-31 06:08:32.753723
4467	128	2026-03-18	5	4	1	t	960	13.282881	80	32	2026-03-31 06:08:32.75562
4468	128	2026-03-19	5	4	1	t	960	14.164181	80	32	2026-03-31 06:08:32.757649
4469	128	2026-03-20	5	4	1	t	960	11.789508	80	32	2026-03-31 06:08:32.759548
4470	128	2026-03-21	5	4	1	t	960	13.356707	80	32	2026-03-31 06:08:32.76197
4471	128	2026-03-22	5	3	2	t	720	8.660512	60	24	2026-03-31 06:08:32.764042
4472	128	2026-03-23	5	4	1	t	960	14.799347	80	32	2026-03-31 06:08:32.76648
4473	128	2026-03-24	5	4	1	t	960	14.797653	80	32	2026-03-31 06:08:32.768959
4474	128	2026-03-25	5	4	1	t	960	14.309838	80	32	2026-03-31 06:08:32.771328
4475	128	2026-03-26	5	4	1	t	960	13.96509	80	32	2026-03-31 06:08:32.773959
4476	128	2026-03-27	5	4	1	t	960	12.169388	80	32	2026-03-31 06:08:32.77592
4477	128	2026-03-28	5	3	2	t	720	9.330484	60	24	2026-03-31 06:08:32.778396
4478	128	2026-03-29	5	4	1	t	960	13.569831	80	32	2026-03-31 06:08:32.780795
4479	128	2026-03-30	5	3	2	t	720	9.467871	60	24	2026-03-31 06:08:32.782727
4480	128	2026-03-31	5	4	1	t	960	13.791418	80	32	2026-03-31 06:08:32.785153
4481	129	2026-02-25	5	4	1	f	1120	8.739675	96	36	2026-03-31 06:08:32.848381
4482	129	2026-02-26	5	5	0	f	1400	13.919202	120	45	2026-03-31 06:08:32.850983
4483	129	2026-02-27	5	4	1	t	1120	10.190948	96	36	2026-03-31 06:08:32.853283
4484	129	2026-02-28	5	4	1	t	1120	11.248903	96	36	2026-03-31 06:08:32.855482
4485	129	2026-03-01	5	5	0	t	1400	10.55037	120	45	2026-03-31 06:08:32.857861
4486	129	2026-03-02	5	4	1	t	1120	8.166335	96	36	2026-03-31 06:08:32.860343
4487	129	2026-03-03	5	5	0	t	1400	11.60715	120	45	2026-03-31 06:08:32.862841
4488	129	2026-03-04	5	5	0	t	1400	13.42501	120	45	2026-03-31 06:08:32.864845
4489	129	2026-03-05	5	4	1	t	1120	10.926441	96	36	2026-03-31 06:08:32.867874
4490	129	2026-03-06	5	4	1	t	1120	10.554166	96	36	2026-03-31 06:08:32.870425
4491	129	2026-03-07	5	5	0	t	1400	11.942142	120	45	2026-03-31 06:08:32.873024
4492	129	2026-03-08	5	4	1	t	1120	8.076529	96	36	2026-03-31 06:08:32.875464
4493	129	2026-03-09	5	4	1	t	1120	9.873262	96	36	2026-03-31 06:08:32.877997
4494	129	2026-03-10	5	4	1	t	1120	8.544219	96	36	2026-03-31 06:08:32.881332
4495	129	2026-03-11	5	4	1	t	1120	9.317699	96	36	2026-03-31 06:08:32.88326
4496	129	2026-03-12	5	4	1	t	1120	8.548479	96	36	2026-03-31 06:08:32.885713
4497	129	2026-03-13	5	4	1	t	1120	8.474647	96	36	2026-03-31 06:08:32.887694
4498	129	2026-03-14	5	4	1	t	1120	9.470894	96	36	2026-03-31 06:08:32.890241
4499	129	2026-03-15	5	4	1	t	1120	10.977189	96	36	2026-03-31 06:08:32.892525
4500	129	2026-03-16	5	4	1	t	1120	8.2824545	96	36	2026-03-31 06:08:32.895095
4501	129	2026-03-17	5	4	1	t	1120	9.664652	96	36	2026-03-31 06:08:32.898039
4502	129	2026-03-18	5	4	1	t	1120	8.045624	96	36	2026-03-31 06:08:32.902592
4503	129	2026-03-19	5	4	1	t	1120	10.498655	96	36	2026-03-31 06:08:32.904879
4504	129	2026-03-20	5	5	0	t	1400	11.714327	120	45	2026-03-31 06:08:32.907473
4505	129	2026-03-21	5	4	1	t	1120	9.730308	96	36	2026-03-31 06:08:32.909842
4506	129	2026-03-22	5	4	1	t	1120	10.489526	96	36	2026-03-31 06:08:32.912432
4507	129	2026-03-23	5	4	1	t	1120	8.104564	96	36	2026-03-31 06:08:32.914561
4508	129	2026-03-24	5	4	1	t	1120	9.482792	96	36	2026-03-31 06:08:32.916963
4509	129	2026-03-25	5	4	1	t	1120	11.743591	96	36	2026-03-31 06:08:32.919673
4510	129	2026-03-26	5	4	1	t	1120	10.62782	96	36	2026-03-31 06:08:32.922158
4511	129	2026-03-27	5	4	1	t	1120	9.110705	96	36	2026-03-31 06:08:32.925051
4512	129	2026-03-28	5	4	1	t	1120	9.812665	96	36	2026-03-31 06:08:32.927534
4513	129	2026-03-29	5	4	1	t	1120	8.616378	96	36	2026-03-31 06:08:32.929818
4514	129	2026-03-30	5	4	1	t	1120	9.524184	96	36	2026-03-31 06:08:32.932144
4515	129	2026-03-31	5	4	1	t	1120	10.22921	96	36	2026-03-31 06:08:32.934368
4516	130	2026-02-25	5	3	2	f	600	36.574535	51	21	2026-03-31 06:08:32.994626
4517	130	2026-02-26	5	3	2	f	600	36.841312	51	21	2026-03-31 06:08:32.997428
4518	130	2026-02-27	5	2	3	f	400	25.16552	34	14	2026-03-31 06:08:33.0002
4519	130	2026-02-28	5	2	3	f	400	26.552341	34	14	2026-03-31 06:08:33.002508
4520	130	2026-03-01	5	2	3	f	400	24.074028	34	14	2026-03-31 06:08:33.005103
4521	130	2026-03-02	5	3	2	f	600	38.410824	51	21	2026-03-31 06:08:33.007153
4522	130	2026-03-03	5	2	3	f	400	25.088846	34	14	2026-03-31 06:08:33.009685
4523	130	2026-03-04	5	3	2	f	600	39.18978	51	21	2026-03-31 06:08:33.011815
4524	130	2026-03-05	5	2	3	f	400	25.696358	34	14	2026-03-31 06:08:33.014273
4525	130	2026-03-06	5	3	2	f	600	38.553486	51	21	2026-03-31 06:08:33.016214
4526	130	2026-03-07	5	2	3	f	400	26.013763	34	14	2026-03-31 06:08:33.018677
4527	130	2026-03-08	5	2	3	f	400	27.41948	34	14	2026-03-31 06:08:33.020681
4528	130	2026-03-09	5	2	3	f	400	25.901531	34	14	2026-03-31 06:08:33.023438
4529	130	2026-03-10	5	2	3	f	400	25.393707	34	14	2026-03-31 06:08:33.02571
4530	130	2026-03-11	5	2	3	f	400	24.311157	34	14	2026-03-31 06:08:33.028361
4531	130	2026-03-12	5	3	2	t	600	39.54883	51	21	2026-03-31 06:08:33.030559
4532	130	2026-03-13	5	2	3	t	400	27.523386	34	14	2026-03-31 06:08:33.032659
4533	130	2026-03-14	5	2	3	t	400	26.371794	34	14	2026-03-31 06:08:33.034766
4534	130	2026-03-15	5	2	3	t	400	25.36829	34	14	2026-03-31 06:08:33.037022
4535	130	2026-03-16	5	3	2	t	600	37.057285	51	21	2026-03-31 06:08:33.039045
4536	130	2026-03-17	5	2	3	t	400	25.392492	34	14	2026-03-31 06:08:33.041318
4537	130	2026-03-18	5	2	3	t	400	26.265047	34	14	2026-03-31 06:08:33.043694
4538	130	2026-03-19	5	2	3	t	400	24.519037	34	14	2026-03-31 06:08:33.045744
4539	130	2026-03-20	5	2	3	t	400	25.347181	34	14	2026-03-31 06:08:33.048022
4540	130	2026-03-21	5	3	2	t	600	38.00855	51	21	2026-03-31 06:08:33.050461
4541	130	2026-03-22	5	3	2	t	600	39.305664	51	21	2026-03-31 06:08:33.052753
4542	130	2026-03-23	5	2	3	t	400	26.983889	34	14	2026-03-31 06:08:33.055324
4543	130	2026-03-24	5	3	2	t	600	40.076965	51	21	2026-03-31 06:08:33.057928
4544	130	2026-03-25	5	3	2	t	600	36.72965	51	21	2026-03-31 06:08:33.060588
4545	130	2026-03-26	5	2	3	t	400	24.7845	34	14	2026-03-31 06:08:33.063088
4546	130	2026-03-27	5	3	2	t	600	38.381958	51	21	2026-03-31 06:08:33.065686
4547	130	2026-03-28	5	2	3	t	400	27.046196	34	14	2026-03-31 06:08:33.067846
4548	130	2026-03-29	5	2	3	t	400	24.664131	34	14	2026-03-31 06:08:33.070386
4549	130	2026-03-30	5	3	2	t	600	38.566647	51	21	2026-03-31 06:08:33.072888
4550	130	2026-03-31	5	3	2	t	600	38.77235	51	21	2026-03-31 06:08:33.075362
4551	131	2026-02-25	5	3	2	f	720	10.844467	60	24	2026-03-31 06:08:33.137104
4552	131	2026-02-26	5	4	1	f	960	12.305318	80	32	2026-03-31 06:08:33.139131
4553	131	2026-02-27	5	3	2	f	720	8.932186	60	24	2026-03-31 06:08:33.141045
4554	131	2026-02-28	5	4	1	f	960	14.551524	80	32	2026-03-31 06:08:33.143594
4555	131	2026-03-01	5	4	1	f	960	13.954826	80	32	2026-03-31 06:08:33.146235
4556	131	2026-03-02	5	4	1	f	960	11.529225	80	32	2026-03-31 06:08:33.148315
4557	131	2026-03-03	5	4	1	f	960	11.943156	80	32	2026-03-31 06:08:33.150403
4558	131	2026-03-04	5	3	2	t	720	9.775422	60	24	2026-03-31 06:08:33.152367
4559	131	2026-03-05	5	4	1	t	960	11.842573	80	32	2026-03-31 06:08:33.154328
4560	131	2026-03-06	5	4	1	t	960	13.784005	80	32	2026-03-31 06:08:33.156265
4561	131	2026-03-07	5	3	2	t	720	10.710831	60	24	2026-03-31 06:08:33.158109
4562	131	2026-03-08	5	3	2	t	720	9.991888	60	24	2026-03-31 06:08:33.160362
4563	131	2026-03-09	5	3	2	t	720	8.431057	60	24	2026-03-31 06:08:33.162393
4564	131	2026-03-10	5	4	1	t	960	12.517104	80	32	2026-03-31 06:08:33.164856
4565	131	2026-03-11	5	3	2	t	720	8.799531	60	24	2026-03-31 06:08:33.166818
4566	131	2026-03-12	5	3	2	t	720	10.826907	60	24	2026-03-31 06:08:33.169326
4567	131	2026-03-13	5	3	2	t	720	11.036708	60	24	2026-03-31 06:08:33.171399
4568	131	2026-03-14	5	3	2	t	720	11.153736	60	24	2026-03-31 06:08:33.173634
4569	131	2026-03-15	5	4	1	t	960	11.604899	80	32	2026-03-31 06:08:33.176329
4570	131	2026-03-16	5	3	2	t	720	8.089725	60	24	2026-03-31 06:08:33.178527
4571	131	2026-03-17	5	4	1	t	960	12.797371	80	32	2026-03-31 06:08:33.181142
4572	131	2026-03-18	5	3	2	t	720	9.260847	60	24	2026-03-31 06:08:33.18426
4573	131	2026-03-19	5	4	1	t	960	12.900108	80	32	2026-03-31 06:08:33.186561
4574	131	2026-03-20	5	3	2	t	720	8.558552	60	24	2026-03-31 06:08:33.189162
4575	131	2026-03-21	5	3	2	t	720	10.117793	60	24	2026-03-31 06:08:33.191613
4576	131	2026-03-22	5	4	1	t	960	14.00505	80	32	2026-03-31 06:08:33.193711
4577	131	2026-03-23	5	3	2	t	720	9.461002	60	24	2026-03-31 06:08:33.195768
4578	131	2026-03-24	5	4	1	t	960	11.096588	80	32	2026-03-31 06:08:33.19796
4579	131	2026-03-25	5	4	1	t	960	13.226536	80	32	2026-03-31 06:08:33.200016
4580	131	2026-03-26	5	3	2	t	720	11.101492	60	24	2026-03-31 06:08:33.202574
4581	131	2026-03-27	5	3	2	t	720	10.964789	60	24	2026-03-31 06:08:33.204457
4582	131	2026-03-28	5	3	2	t	720	9.961331	60	24	2026-03-31 06:08:33.207368
4583	131	2026-03-29	5	4	1	t	960	12.34325	80	32	2026-03-31 06:08:33.209419
4584	131	2026-03-30	5	3	2	t	720	8.312239	60	24	2026-03-31 06:08:33.212357
4585	131	2026-03-31	5	3	2	t	720	11.40137	60	24	2026-03-31 06:08:33.214529
4586	132	2026-02-25	5	4	1	t	1280	11.832524	108	40	2026-03-31 06:08:33.27645
4587	132	2026-02-26	5	5	0	t	1600	17.62928	135	50	2026-03-31 06:08:33.278488
4588	132	2026-02-27	5	5	0	t	1600	16.95881	135	50	2026-03-31 06:08:33.280587
4589	132	2026-02-28	5	4	1	t	1280	12.3975525	108	40	2026-03-31 06:08:33.282999
4590	132	2026-03-01	5	4	1	t	1280	13.780389	108	40	2026-03-31 06:08:33.284888
4591	132	2026-03-02	5	5	0	t	1600	15.3425865	135	50	2026-03-31 06:08:33.287254
4592	132	2026-03-03	5	4	1	t	1280	12.125542	108	40	2026-03-31 06:08:33.289638
4593	132	2026-03-04	5	4	1	t	1280	11.60551	108	40	2026-03-31 06:08:33.292091
4594	132	2026-03-05	5	5	0	t	1600	17.766573	135	50	2026-03-31 06:08:33.294272
4595	132	2026-03-06	5	5	0	t	1600	17.022385	135	50	2026-03-31 06:08:33.296637
4596	132	2026-03-07	5	5	0	t	1600	15.326304	135	50	2026-03-31 06:08:33.29902
4597	132	2026-03-08	5	4	1	t	1280	11.044394	108	40	2026-03-31 06:08:33.302015
4598	132	2026-03-09	5	5	0	t	1600	14.557473	135	50	2026-03-31 06:08:33.304287
4599	132	2026-03-10	5	5	0	t	1600	15.659372	135	50	2026-03-31 06:08:33.306251
4600	132	2026-03-11	5	4	1	t	1280	12.119696	108	40	2026-03-31 06:08:33.308718
4601	132	2026-03-12	5	4	1	t	1280	12.721571	108	40	2026-03-31 06:08:33.310643
4602	132	2026-03-13	5	5	0	t	1600	13.951387	135	50	2026-03-31 06:08:33.313005
4603	132	2026-03-14	5	4	1	t	1280	13.724884	108	40	2026-03-31 06:08:33.315147
4604	132	2026-03-15	5	4	1	t	1280	12.5372095	108	40	2026-03-31 06:08:33.317321
4605	132	2026-03-16	5	5	0	t	1600	17.550974	135	50	2026-03-31 06:08:33.319557
4606	132	2026-03-17	5	5	0	t	1600	15.168655	135	50	2026-03-31 06:08:33.321646
4607	132	2026-03-18	5	5	0	t	1600	16.576406	135	50	2026-03-31 06:08:33.323857
4608	132	2026-03-19	5	4	1	t	1280	14.300342	108	40	2026-03-31 06:08:33.32657
4609	132	2026-03-20	5	5	0	t	1600	14.400625	135	50	2026-03-31 06:08:33.329194
4610	132	2026-03-21	5	5	0	t	1600	16.473373	135	50	2026-03-31 06:08:33.331323
4611	132	2026-03-22	5	5	0	t	1600	16.569693	135	50	2026-03-31 06:08:33.333785
4612	132	2026-03-23	5	5	0	t	1600	14.86914	135	50	2026-03-31 06:08:33.336157
4613	132	2026-03-24	5	5	0	t	1600	16.08602	135	50	2026-03-31 06:08:33.338079
4614	132	2026-03-25	5	5	0	t	1600	16.486034	135	50	2026-03-31 06:08:33.340112
4615	132	2026-03-26	5	4	1	t	1280	14.19947	108	40	2026-03-31 06:08:33.342101
4616	132	2026-03-27	5	4	1	t	1280	13.733247	108	40	2026-03-31 06:08:33.344584
4617	132	2026-03-28	5	5	0	t	1600	17.654848	135	50	2026-03-31 06:08:33.34656
4618	132	2026-03-29	5	5	0	t	1600	16.827465	135	50	2026-03-31 06:08:33.349035
4619	132	2026-03-30	5	4	1	t	1280	11.490463	108	40	2026-03-31 06:08:33.351067
4620	132	2026-03-31	5	5	0	t	1600	14.283388	135	50	2026-03-31 06:08:33.353441
4621	133	2026-02-25	5	3	2	f	600	34.913673	51	21	2026-03-31 06:08:33.413298
4622	133	2026-02-26	5	3	2	f	600	34.34626	51	21	2026-03-31 06:08:33.415485
4623	133	2026-02-27	5	3	2	f	600	31.647848	51	21	2026-03-31 06:08:33.417484
4624	133	2026-02-28	5	3	2	f	600	35.31098	51	21	2026-03-31 06:08:33.419787
4625	133	2026-03-01	5	3	2	f	600	33.703598	51	21	2026-03-31 06:08:33.422138
4626	133	2026-03-02	5	3	2	f	600	34.89529	51	21	2026-03-31 06:08:33.42457
4627	133	2026-03-03	5	2	3	f	400	23.664762	34	14	2026-03-31 06:08:33.426802
4628	133	2026-03-04	5	3	2	f	600	34.74599	51	21	2026-03-31 06:08:33.429275
4629	133	2026-03-05	5	3	2	f	600	33.620346	51	21	2026-03-31 06:08:33.431081
4630	133	2026-03-06	5	3	2	f	600	35.317375	51	21	2026-03-31 06:08:33.433586
4631	133	2026-03-07	5	3	2	f	600	33.250656	51	21	2026-03-31 06:08:33.436182
4632	133	2026-03-08	5	3	2	f	600	31.587336	51	21	2026-03-31 06:08:33.438775
4633	133	2026-03-09	5	3	2	t	600	33.11742	51	21	2026-03-31 06:08:33.441356
4634	133	2026-03-10	5	3	2	t	600	34.763577	51	21	2026-03-31 06:08:33.443468
4635	133	2026-03-11	5	3	2	t	600	33.11693	51	21	2026-03-31 06:08:33.445522
4636	133	2026-03-12	5	2	3	t	400	22.385012	34	14	2026-03-31 06:08:33.448043
4637	133	2026-03-13	5	3	2	t	600	34.65148	51	21	2026-03-31 06:08:33.450133
4638	133	2026-03-14	5	3	2	t	600	33.90917	51	21	2026-03-31 06:08:33.452138
4639	133	2026-03-15	5	2	3	t	400	21.204433	34	14	2026-03-31 06:08:33.454984
4640	133	2026-03-16	5	2	3	t	400	22.510677	34	14	2026-03-31 06:08:33.45713
4641	133	2026-03-17	5	3	2	t	600	32.53602	51	21	2026-03-31 06:08:33.459227
4642	133	2026-03-18	5	3	2	t	600	33.638237	51	21	2026-03-31 06:08:33.461298
4643	133	2026-03-19	5	3	2	t	600	34.199272	51	21	2026-03-31 06:08:33.463247
4644	133	2026-03-20	5	3	2	t	600	33.923546	51	21	2026-03-31 06:08:33.465337
4645	133	2026-03-21	5	3	2	t	600	33.43685	51	21	2026-03-31 06:08:33.467314
4646	133	2026-03-22	5	3	2	t	600	34.931717	51	21	2026-03-31 06:08:33.470709
4647	133	2026-03-23	5	3	2	t	600	34.177197	51	21	2026-03-31 06:08:33.472737
4648	133	2026-03-24	5	3	2	t	600	33.46487	51	21	2026-03-31 06:08:33.474896
4649	133	2026-03-25	5	2	3	t	400	23.907345	34	14	2026-03-31 06:08:33.476883
4650	133	2026-03-26	5	3	2	t	600	32.319275	51	21	2026-03-31 06:08:33.479063
4651	133	2026-03-27	5	3	2	t	600	32.7051	51	21	2026-03-31 06:08:33.481368
4652	133	2026-03-28	5	3	2	t	600	34.813255	51	21	2026-03-31 06:08:33.483773
4653	133	2026-03-29	5	3	2	t	600	34.654747	51	21	2026-03-31 06:08:33.485606
4654	133	2026-03-30	5	3	2	t	600	32.50434	51	21	2026-03-31 06:08:33.488577
4655	133	2026-03-31	5	3	2	t	600	33.52186	51	21	2026-03-31 06:08:33.490564
4656	134	2026-02-25	5	4	1	f	1120	9.134901	96	36	2026-03-31 06:08:33.553636
4657	134	2026-02-26	5	4	1	f	1120	9.200206	96	36	2026-03-31 06:08:33.556233
4658	134	2026-02-27	5	4	1	f	1120	11.672767	96	36	2026-03-31 06:08:33.558626
4659	134	2026-02-28	5	4	1	t	1120	8.095183	96	36	2026-03-31 06:08:33.560541
4660	134	2026-03-01	5	4	1	t	1120	9.140915	96	36	2026-03-31 06:08:33.563039
4661	134	2026-03-02	5	4	1	t	1120	8.953495	96	36	2026-03-31 06:08:33.565731
4662	134	2026-03-03	5	4	1	t	1120	10.870732	96	36	2026-03-31 06:08:33.568121
4663	134	2026-03-04	5	5	0	t	1400	13.467196	120	45	2026-03-31 06:08:33.570055
4664	134	2026-03-05	5	4	1	t	1120	10.302435	96	36	2026-03-31 06:08:33.5721
4665	134	2026-03-06	5	4	1	t	1120	9.866729	96	36	2026-03-31 06:08:33.573895
4666	134	2026-03-07	5	5	0	t	1400	11.214127	120	45	2026-03-31 06:08:33.576297
4667	134	2026-03-08	5	4	1	t	1120	10.516812	96	36	2026-03-31 06:08:33.578253
4668	134	2026-03-09	5	4	1	t	1120	11.368183	96	36	2026-03-31 06:08:33.580844
4669	134	2026-03-10	5	4	1	t	1120	10.089504	96	36	2026-03-31 06:08:33.583295
4670	134	2026-03-11	5	4	1	t	1120	8.6123295	96	36	2026-03-31 06:08:33.585688
4671	134	2026-03-12	5	4	1	t	1120	9.680104	96	36	2026-03-31 06:08:33.588183
4672	134	2026-03-13	5	4	1	t	1120	9.490733	96	36	2026-03-31 06:08:33.590687
4673	134	2026-03-14	5	4	1	t	1120	7.967521	96	36	2026-03-31 06:08:33.593692
4674	134	2026-03-15	5	4	1	t	1120	10.703941	96	36	2026-03-31 06:08:33.596187
4675	134	2026-03-16	5	4	1	t	1120	9.061843	96	36	2026-03-31 06:08:33.598173
4676	134	2026-03-17	5	4	1	t	1120	9.939161	96	36	2026-03-31 06:08:33.600228
4677	134	2026-03-18	5	4	1	t	1120	9.083709	96	36	2026-03-31 06:08:33.602108
4678	134	2026-03-19	5	4	1	t	1120	11.178817	96	36	2026-03-31 06:08:33.604156
4679	134	2026-03-20	5	4	1	t	1120	9.600356	96	36	2026-03-31 06:08:33.606239
4680	134	2026-03-21	5	4	1	t	1120	9.273428	96	36	2026-03-31 06:08:33.608461
4681	134	2026-03-22	5	4	1	t	1120	9.640117	96	36	2026-03-31 06:08:33.61133
4682	134	2026-03-23	5	4	1	t	1120	11.559806	96	36	2026-03-31 06:08:33.613932
4683	134	2026-03-24	5	4	1	t	1120	9.932696	96	36	2026-03-31 06:08:33.617056
4684	134	2026-03-25	5	4	1	t	1120	11.403653	96	36	2026-03-31 06:08:33.619323
4685	134	2026-03-26	5	4	1	t	1120	10.019525	96	36	2026-03-31 06:08:33.621162
4686	134	2026-03-27	5	4	1	t	1120	11.176675	96	36	2026-03-31 06:08:33.623661
4687	134	2026-03-28	5	4	1	t	1120	9.736938	96	36	2026-03-31 06:08:33.625697
4688	134	2026-03-29	5	4	1	t	1120	11.092902	96	36	2026-03-31 06:08:33.627936
4689	134	2026-03-30	5	4	1	t	1120	8.480865	96	36	2026-03-31 06:08:33.630531
4690	134	2026-03-31	5	4	1	t	1120	9.660881	96	36	2026-03-31 06:08:33.632578
4691	135	2026-02-25	5	2	3	f	400	10.260673	34	14	2026-03-31 06:08:33.69516
4692	135	2026-02-26	5	1	4	f	200	3.1829708	17	7	2026-03-31 06:08:33.697701
4693	135	2026-02-27	5	1	4	f	200	5.911989	17	7	2026-03-31 06:08:33.70015
4694	135	2026-02-28	5	1	4	f	200	6.4954233	17	7	2026-03-31 06:08:33.702528
4695	135	2026-03-01	5	2	3	f	400	6.8493056	34	14	2026-03-31 06:08:33.705507
4696	135	2026-03-02	5	2	3	f	400	8.853278	34	14	2026-03-31 06:08:33.708007
4697	135	2026-03-03	5	2	3	f	400	8.147067	34	14	2026-03-31 06:08:33.710272
4698	135	2026-03-04	5	2	3	f	400	8.84881	34	14	2026-03-31 06:08:33.712429
4699	135	2026-03-05	5	1	4	f	200	5.4790897	17	7	2026-03-31 06:08:33.714325
4700	135	2026-03-06	5	2	3	f	400	6.6714034	34	14	2026-03-31 06:08:33.716765
4701	135	2026-03-07	5	2	3	f	400	7.6120644	34	14	2026-03-31 06:08:33.719054
4702	135	2026-03-08	5	2	3	f	400	8.320971	34	14	2026-03-31 06:08:33.720954
4703	135	2026-03-09	5	2	3	f	400	8.943848	34	14	2026-03-31 06:08:33.723209
4704	135	2026-03-10	5	2	3	f	400	8.204733	34	14	2026-03-31 06:08:33.72573
4705	135	2026-03-11	5	1	4	f	200	3.3986037	17	7	2026-03-31 06:08:33.728112
4706	135	2026-03-12	5	1	4	f	200	6.3407826	17	7	2026-03-31 06:08:33.730869
4707	135	2026-03-13	5	2	3	f	400	9.836091	34	14	2026-03-31 06:08:33.733063
4708	135	2026-03-14	5	1	4	f	200	3.2060335	17	7	2026-03-31 06:08:33.735393
4709	135	2026-03-15	5	1	4	f	200	6.5108523	17	7	2026-03-31 06:08:33.73716
4710	135	2026-03-16	5	1	4	f	200	4.2598486	17	7	2026-03-31 06:08:33.739313
4711	135	2026-03-17	5	2	3	f	400	8.107081	34	14	2026-03-31 06:08:33.741167
4712	135	2026-03-18	5	1	4	t	200	5.8029532	17	7	2026-03-31 06:08:33.743175
4713	135	2026-03-19	5	2	3	t	400	7.5683846	34	14	2026-03-31 06:08:33.745083
4714	135	2026-03-20	5	2	3	t	400	9.087533	34	14	2026-03-31 06:08:33.747479
4715	135	2026-03-21	5	1	4	t	200	5.7444186	17	7	2026-03-31 06:08:33.749817
4716	135	2026-03-22	5	2	3	t	400	8.052842	34	14	2026-03-31 06:08:33.752159
4717	135	2026-03-23	5	2	3	t	400	7.1472135	34	14	2026-03-31 06:08:33.754091
4718	135	2026-03-24	5	2	3	t	400	9.460347	34	14	2026-03-31 06:08:33.756087
4719	135	2026-03-25	5	1	4	t	200	4.1721344	17	7	2026-03-31 06:08:33.758935
4720	135	2026-03-26	5	1	4	t	200	3.7482438	17	7	2026-03-31 06:08:33.760891
4721	135	2026-03-27	5	2	3	t	400	8.490012	34	14	2026-03-31 06:08:33.763163
4722	135	2026-03-28	5	2	3	t	400	10.151163	34	14	2026-03-31 06:08:33.76552
4723	135	2026-03-29	5	2	3	t	400	9.32708	34	14	2026-03-31 06:08:33.767324
4724	135	2026-03-30	5	1	4	t	200	6.2126656	17	7	2026-03-31 06:08:33.769532
4725	135	2026-03-31	5	2	3	t	400	7.029915	34	14	2026-03-31 06:08:33.771998
4726	136	2026-02-25	5	3	2	f	600	27.191439	51	21	2026-03-31 06:08:33.833699
4727	136	2026-02-26	5	3	2	f	600	26.024145	51	21	2026-03-31 06:08:33.836138
4728	136	2026-02-27	5	4	1	f	800	34.694496	68	28	2026-03-31 06:08:33.838602
4729	136	2026-02-28	5	4	1	f	800	37.054497	68	28	2026-03-31 06:08:33.840725
4730	136	2026-03-01	5	4	1	f	800	36.206512	68	28	2026-03-31 06:08:33.843602
4731	136	2026-03-02	5	3	2	f	600	29.349846	51	21	2026-03-31 06:08:33.845503
4732	136	2026-03-03	5	4	1	f	800	36.75478	68	28	2026-03-31 06:08:33.847569
4733	136	2026-03-04	5	3	2	f	600	27.907354	51	21	2026-03-31 06:08:33.850108
4734	136	2026-03-05	5	3	2	t	600	27.480593	51	21	2026-03-31 06:08:33.852513
4735	136	2026-03-06	5	3	2	t	600	25.657152	51	21	2026-03-31 06:08:33.854417
4736	136	2026-03-07	5	4	1	t	800	36.30105	68	28	2026-03-31 06:08:33.856797
4737	136	2026-03-08	5	4	1	t	800	35.087883	68	28	2026-03-31 06:08:33.85919
4738	136	2026-03-09	5	3	2	t	600	29.234318	51	21	2026-03-31 06:08:33.86156
4739	136	2026-03-10	5	3	2	t	600	28.93165	51	21	2026-03-31 06:08:33.863463
4740	136	2026-03-11	5	4	1	t	800	36.21003	68	28	2026-03-31 06:08:33.865725
4741	136	2026-03-12	5	4	1	t	800	35.290237	68	28	2026-03-31 06:08:33.868269
4742	136	2026-03-13	5	3	2	t	600	25.969494	51	21	2026-03-31 06:08:33.870813
4743	136	2026-03-14	5	3	2	t	600	27.25032	51	21	2026-03-31 06:08:33.873263
4744	136	2026-03-15	5	4	1	t	800	35.448513	68	28	2026-03-31 06:08:33.876134
4745	136	2026-03-16	5	4	1	t	800	34.702843	68	28	2026-03-31 06:08:33.878155
4746	136	2026-03-17	5	3	2	t	600	26.906843	51	21	2026-03-31 06:08:33.880496
4747	136	2026-03-18	5	3	2	t	600	29.12495	51	21	2026-03-31 06:08:33.882958
4748	136	2026-03-19	5	4	1	t	800	35.479584	68	28	2026-03-31 06:08:33.885409
4749	136	2026-03-20	5	4	1	t	800	34.83886	68	28	2026-03-31 06:08:33.88737
4750	136	2026-03-21	5	3	2	t	600	27.078949	51	21	2026-03-31 06:08:33.8894
4751	136	2026-03-22	5	4	1	t	800	36.43328	68	28	2026-03-31 06:08:33.891992
4752	136	2026-03-23	5	3	2	t	600	26.94982	51	21	2026-03-31 06:08:33.89412
4753	136	2026-03-24	5	3	2	t	600	28.4261	51	21	2026-03-31 06:08:33.896702
4754	136	2026-03-25	5	3	2	t	600	29.275047	51	21	2026-03-31 06:08:33.89909
4755	136	2026-03-26	5	3	2	t	600	27.575798	51	21	2026-03-31 06:08:33.901287
4756	136	2026-03-27	5	4	1	t	800	34.625046	68	28	2026-03-31 06:08:33.903785
4757	136	2026-03-28	5	4	1	t	800	38.25573	68	28	2026-03-31 06:08:33.905677
4758	136	2026-03-29	5	4	1	t	800	37.464966	68	28	2026-03-31 06:08:33.90854
4759	136	2026-03-30	5	3	2	t	600	28.1879	51	21	2026-03-31 06:08:33.910878
4760	136	2026-03-31	5	3	2	t	600	26.718756	51	21	2026-03-31 06:08:33.913313
4761	137	2026-02-25	5	5	0	f	1200	17.183445	100	40	2026-03-31 06:08:33.97491
4762	137	2026-02-26	5	4	1	t	960	14.120709	80	32	2026-03-31 06:08:33.97723
4763	137	2026-02-27	5	4	1	t	960	14.014955	80	32	2026-03-31 06:08:33.979357
4764	137	2026-02-28	5	5	0	t	1200	14.741838	100	40	2026-03-31 06:08:33.981891
4765	137	2026-03-01	5	4	1	t	960	11.583886	80	32	2026-03-31 06:08:33.983867
4766	137	2026-03-02	5	4	1	t	960	12.448911	80	32	2026-03-31 06:08:33.985936
4767	137	2026-03-03	5	4	1	t	960	12.087158	80	32	2026-03-31 06:08:33.988272
4768	137	2026-03-04	5	4	1	t	960	12.053452	80	32	2026-03-31 06:08:33.990948
4769	137	2026-03-05	5	4	1	t	960	12.633917	80	32	2026-03-31 06:08:33.993044
4770	137	2026-03-06	5	5	0	t	1200	15.80311	100	40	2026-03-31 06:08:33.995604
4771	137	2026-03-07	5	4	1	t	960	13.661877	80	32	2026-03-31 06:08:33.998404
4772	137	2026-03-08	5	4	1	t	960	12.880565	80	32	2026-03-31 06:08:34.001176
4773	137	2026-03-09	5	4	1	t	960	13.145458	80	32	2026-03-31 06:08:34.003079
4774	137	2026-03-10	5	4	1	t	960	13.273664	80	32	2026-03-31 06:08:34.005844
4775	137	2026-03-11	5	4	1	t	960	10.991381	80	32	2026-03-31 06:08:34.007774
4776	137	2026-03-12	5	4	1	t	960	12.015399	80	32	2026-03-31 06:08:34.009787
4777	137	2026-03-13	5	4	1	t	960	10.993925	80	32	2026-03-31 06:08:34.012243
4778	137	2026-03-14	5	5	0	t	1200	16.633848	100	40	2026-03-31 06:08:34.014326
4779	137	2026-03-15	5	5	0	t	1200	17.499664	100	40	2026-03-31 06:08:34.01671
4780	137	2026-03-16	5	4	1	t	960	12.988245	80	32	2026-03-31 06:08:34.019008
4781	137	2026-03-17	5	5	0	t	1200	17.540508	100	40	2026-03-31 06:08:34.021338
4782	137	2026-03-18	5	4	1	t	960	10.870375	80	32	2026-03-31 06:08:34.023686
4783	137	2026-03-19	5	4	1	t	960	11.841845	80	32	2026-03-31 06:08:34.026147
4784	137	2026-03-20	5	4	1	t	960	12.673302	80	32	2026-03-31 06:08:34.028451
4785	137	2026-03-21	5	4	1	t	960	11.2749	80	32	2026-03-31 06:08:34.030229
4786	137	2026-03-22	5	4	1	t	960	12.751846	80	32	2026-03-31 06:08:34.032558
4787	137	2026-03-23	5	4	1	t	960	12.997139	80	32	2026-03-31 06:08:34.034477
4788	137	2026-03-24	5	4	1	t	960	12.991306	80	32	2026-03-31 06:08:34.036861
4789	137	2026-03-25	5	5	0	t	1200	13.8303995	100	40	2026-03-31 06:08:34.039362
4790	137	2026-03-26	5	4	1	t	960	12.790396	80	32	2026-03-31 06:08:34.041569
4791	137	2026-03-27	5	4	1	t	960	13.316418	80	32	2026-03-31 06:08:34.044135
4792	137	2026-03-28	5	4	1	t	960	12.879664	80	32	2026-03-31 06:08:34.046369
4793	137	2026-03-29	5	5	0	t	1200	16.595066	100	40	2026-03-31 06:08:34.048536
4794	137	2026-03-30	5	4	1	t	960	13.15259	80	32	2026-03-31 06:08:34.050893
4795	137	2026-03-31	5	4	1	t	960	12.65909	80	32	2026-03-31 06:08:34.053683
4796	138	2026-02-25	5	1	4	f	320	3.493684	27	10	2026-03-31 06:08:34.120063
4797	138	2026-02-26	5	1	4	f	320	4.0732265	27	10	2026-03-31 06:08:34.122122
4798	138	2026-02-27	5	1	4	f	320	3.2081919	27	10	2026-03-31 06:08:34.12426
4799	138	2026-02-28	5	2	3	f	640	5.124449	54	20	2026-03-31 06:08:34.126335
4800	138	2026-03-01	5	1	4	f	320	5.627988	27	10	2026-03-31 06:08:34.129076
4801	138	2026-03-02	5	2	3	f	640	7.344954	54	20	2026-03-31 06:08:34.131381
4802	138	2026-03-03	5	2	3	f	640	7.682653	54	20	2026-03-31 06:08:34.13369
4803	138	2026-03-04	5	1	4	f	320	2.3669338	27	10	2026-03-31 06:08:34.136263
4804	138	2026-03-05	5	2	3	f	640	8.392216	54	20	2026-03-31 06:08:34.138771
4805	138	2026-03-06	5	1	4	f	320	2.4147182	27	10	2026-03-31 06:08:34.141018
4806	138	2026-03-07	5	1	4	f	320	4.447215	27	10	2026-03-31 06:08:34.144354
4807	138	2026-03-08	5	2	3	f	640	6.669034	54	20	2026-03-31 06:08:34.146785
4808	138	2026-03-09	5	2	3	f	640	5.058009	54	20	2026-03-31 06:08:34.149447
4809	138	2026-03-10	5	1	4	f	320	5.3250065	27	10	2026-03-31 06:08:34.152196
4810	138	2026-03-11	5	1	4	f	320	3.2385092	27	10	2026-03-31 06:08:34.155521
4811	138	2026-03-12	5	2	3	f	640	7.954648	54	20	2026-03-31 06:08:34.158011
4812	138	2026-03-13	5	1	4	f	320	5.6947913	27	10	2026-03-31 06:08:34.160597
4813	138	2026-03-14	5	1	4	f	320	3.306618	27	10	2026-03-31 06:08:34.163265
4814	138	2026-03-15	5	1	4	f	320	3.6640751	27	10	2026-03-31 06:08:34.166072
4815	138	2026-03-16	5	1	4	f	320	3.3179066	27	10	2026-03-31 06:08:34.168424
4816	138	2026-03-17	5	1	4	f	320	5.073864	27	10	2026-03-31 06:08:34.171025
4817	138	2026-03-18	5	1	4	f	320	2.9256773	27	10	2026-03-31 06:08:34.173353
4818	138	2026-03-19	5	2	3	f	640	8.254609	54	20	2026-03-31 06:08:34.176297
4819	138	2026-03-20	5	1	4	t	320	3.9522545	27	10	2026-03-31 06:08:34.17858
4820	138	2026-03-21	5	2	3	t	640	8.1284685	54	20	2026-03-31 06:08:34.181529
4821	138	2026-03-22	5	1	4	t	320	2.7591422	27	10	2026-03-31 06:08:34.184108
4822	138	2026-03-23	5	2	3	t	640	6.8542366	54	20	2026-03-31 06:08:34.186809
4823	138	2026-03-24	5	1	4	t	320	5.0204916	27	10	2026-03-31 06:08:34.189315
4824	138	2026-03-25	5	1	4	t	320	4.295297	27	10	2026-03-31 06:08:34.191647
4825	138	2026-03-26	5	1	4	t	320	2.4522593	27	10	2026-03-31 06:08:34.194794
4826	138	2026-03-27	5	2	3	t	640	5.3823833	54	20	2026-03-31 06:08:34.19795
4827	138	2026-03-28	5	1	4	t	320	2.297421	27	10	2026-03-31 06:08:34.200438
4828	138	2026-03-29	5	1	4	t	320	3.2179596	27	10	2026-03-31 06:08:34.2032
4829	138	2026-03-30	5	1	4	t	320	3.8046412	27	10	2026-03-31 06:08:34.205684
4830	138	2026-03-31	5	2	3	t	640	8.360995	54	20	2026-03-31 06:08:34.208097
4831	139	2026-02-25	5	4	1	f	960	12.774066	80	32	2026-03-31 06:08:34.274196
4832	139	2026-02-26	5	4	1	f	960	11.248402	80	32	2026-03-31 06:08:34.276589
4833	139	2026-02-27	5	4	1	f	960	12.48862	80	32	2026-03-31 06:08:34.279009
4834	139	2026-02-28	5	3	2	f	720	9.213546	60	24	2026-03-31 06:08:34.281931
4835	139	2026-03-01	5	3	2	f	720	8.623961	60	24	2026-03-31 06:08:34.283976
4836	139	2026-03-02	5	3	2	f	720	9.090671	60	24	2026-03-31 06:08:34.28621
4837	139	2026-03-03	5	3	2	t	720	8.446792	60	24	2026-03-31 06:08:34.288515
4838	139	2026-03-04	5	4	1	t	960	12.536538	80	32	2026-03-31 06:08:34.29054
4839	139	2026-03-05	5	4	1	t	960	13.006727	80	32	2026-03-31 06:08:34.292494
4840	139	2026-03-06	5	3	2	t	720	10.695586	60	24	2026-03-31 06:08:34.294595
4841	139	2026-03-07	5	4	1	t	960	11.749998	80	32	2026-03-31 06:08:34.296641
4842	139	2026-03-08	5	3	2	t	720	11.625424	60	24	2026-03-31 06:08:34.29894
4843	139	2026-03-09	5	4	1	t	960	11.387578	80	32	2026-03-31 06:08:34.30104
4844	139	2026-03-10	5	4	1	t	960	13.796302	80	32	2026-03-31 06:08:34.303476
4845	139	2026-03-11	5	3	2	t	720	10.332305	60	24	2026-03-31 06:08:34.305361
4846	139	2026-03-12	5	4	1	t	960	12.827141	80	32	2026-03-31 06:08:34.307213
4847	139	2026-03-13	5	4	1	t	960	12.771839	80	32	2026-03-31 06:08:34.309106
4848	139	2026-03-14	5	3	2	t	720	8.710127	60	24	2026-03-31 06:08:34.312281
4849	139	2026-03-15	5	3	2	t	720	10.072103	60	24	2026-03-31 06:08:34.314776
4850	139	2026-03-16	5	3	2	t	720	7.965934	60	24	2026-03-31 06:08:34.317161
4851	139	2026-03-17	5	4	1	t	960	13.433986	80	32	2026-03-31 06:08:34.319508
4852	139	2026-03-18	5	3	2	t	720	10.347702	60	24	2026-03-31 06:08:34.322107
4853	139	2026-03-19	5	3	2	t	720	11.305676	60	24	2026-03-31 06:08:34.324223
4854	139	2026-03-20	5	3	2	t	720	10.08381	60	24	2026-03-31 06:08:34.32689
4855	139	2026-03-21	5	3	2	t	720	11.786435	60	24	2026-03-31 06:08:34.329385
4856	139	2026-03-22	5	4	1	t	960	13.096732	80	32	2026-03-31 06:08:34.332391
4857	139	2026-03-23	5	3	2	t	720	10.714315	60	24	2026-03-31 06:08:34.335248
4858	139	2026-03-24	5	3	2	t	720	8.557769	60	24	2026-03-31 06:08:34.338153
4859	139	2026-03-25	5	3	2	t	720	10.383883	60	24	2026-03-31 06:08:34.34091
4860	139	2026-03-26	5	3	2	t	720	10.95452	60	24	2026-03-31 06:08:34.343138
4861	139	2026-03-27	5	4	1	t	960	12.519641	80	32	2026-03-31 06:08:34.346963
4862	139	2026-03-28	5	4	1	t	960	12.456868	80	32	2026-03-31 06:08:34.34939
4863	139	2026-03-29	5	3	2	t	720	9.095186	60	24	2026-03-31 06:08:34.35282
4864	139	2026-03-30	5	4	1	t	960	12.306709	80	32	2026-03-31 06:08:34.355506
4865	139	2026-03-31	5	4	1	t	960	12.461383	80	32	2026-03-31 06:08:34.358331
4866	140	2026-02-25	5	2	3	f	560	20.094814	48	18	2026-03-31 06:08:34.423681
4867	140	2026-02-26	5	2	3	f	560	18.50332	48	18	2026-03-31 06:08:34.426032
4868	140	2026-02-27	5	2	3	f	560	19.193424	48	18	2026-03-31 06:08:34.428377
4869	140	2026-02-28	5	2	3	f	560	19.665815	48	18	2026-03-31 06:08:34.430718
4870	140	2026-03-01	5	2	3	f	560	18.631998	48	18	2026-03-31 06:08:34.432536
4871	140	2026-03-02	5	2	3	f	560	17.342384	48	18	2026-03-31 06:08:34.434629
4872	140	2026-03-03	5	2	3	f	560	18.622398	48	18	2026-03-31 06:08:34.437156
4873	140	2026-03-04	5	2	3	f	560	18.33734	48	18	2026-03-31 06:08:34.439641
4874	140	2026-03-05	5	2	3	f	560	18.356016	48	18	2026-03-31 06:08:34.44176
4875	140	2026-03-06	5	2	3	f	560	18.178583	48	18	2026-03-31 06:08:34.444266
4876	140	2026-03-07	5	2	3	f	560	19.54694	48	18	2026-03-31 06:08:34.446796
4877	140	2026-03-08	5	2	3	f	560	19.522469	48	18	2026-03-31 06:08:34.449576
4878	140	2026-03-09	5	2	3	f	560	20.689016	48	18	2026-03-31 06:08:34.452293
4879	140	2026-03-10	5	2	3	f	560	17.636812	48	18	2026-03-31 06:08:34.454687
4880	140	2026-03-11	5	2	3	f	560	20.569782	48	18	2026-03-31 06:08:34.456691
4881	140	2026-03-12	5	2	3	f	560	16.977757	48	18	2026-03-31 06:08:34.459318
4882	140	2026-03-13	5	2	3	f	560	20.186241	48	18	2026-03-31 06:08:34.461802
4883	140	2026-03-14	5	2	3	t	560	19.09792	48	18	2026-03-31 06:08:34.464124
4884	140	2026-03-15	5	2	3	t	560	20.718395	48	18	2026-03-31 06:08:34.466711
4885	140	2026-03-16	5	2	3	t	560	18.17234	48	18	2026-03-31 06:08:34.468761
4886	140	2026-03-17	5	2	3	t	560	17.149363	48	18	2026-03-31 06:08:34.471163
4887	140	2026-03-18	5	2	3	t	560	18.461695	48	18	2026-03-31 06:08:34.473605
4888	140	2026-03-19	5	2	3	t	560	17.06576	48	18	2026-03-31 06:08:34.47546
4889	140	2026-03-20	5	2	3	t	560	18.013376	48	18	2026-03-31 06:08:34.477893
4890	140	2026-03-21	5	2	3	t	560	20.25311	48	18	2026-03-31 06:08:34.480871
4891	140	2026-03-22	5	2	3	t	560	18.088388	48	18	2026-03-31 06:08:34.483369
4892	140	2026-03-23	5	2	3	t	560	20.584589	48	18	2026-03-31 06:08:34.485714
4893	140	2026-03-24	5	2	3	t	560	19.74162	48	18	2026-03-31 06:08:34.488032
4894	140	2026-03-25	5	2	3	t	560	17.899452	48	18	2026-03-31 06:08:34.489876
4895	140	2026-03-26	5	2	3	t	560	18.29955	48	18	2026-03-31 06:08:34.492262
4896	140	2026-03-27	5	2	3	t	560	18.810682	48	18	2026-03-31 06:08:34.49429
4897	140	2026-03-28	5	2	3	t	560	19.0277	48	18	2026-03-31 06:08:34.496814
4898	140	2026-03-29	5	2	3	t	560	18.312016	48	18	2026-03-31 06:08:34.499278
4899	140	2026-03-30	5	2	3	t	560	17.53284	48	18	2026-03-31 06:08:34.502069
4900	140	2026-03-31	5	2	3	t	560	20.180696	48	18	2026-03-31 06:08:34.504376
4901	141	2026-02-25	5	5	0	t	1000	19.408543	85	35	2026-03-31 06:08:34.564529
4902	141	2026-02-26	5	5	0	t	1000	20.542377	85	35	2026-03-31 06:08:34.567042
4903	141	2026-02-27	5	5	0	t	1000	20.908083	85	35	2026-03-31 06:08:34.569477
4904	141	2026-02-28	5	5	0	t	1000	18.609875	85	35	2026-03-31 06:08:34.572066
4905	141	2026-03-01	5	4	1	t	800	16.259737	68	28	2026-03-31 06:08:34.574478
4906	141	2026-03-02	5	5	0	t	1000	21.039948	85	35	2026-03-31 06:08:34.577526
4907	141	2026-03-03	5	4	1	t	800	14.264092	68	28	2026-03-31 06:08:34.580105
4908	141	2026-03-04	5	5	0	t	1000	21.386068	85	35	2026-03-31 06:08:34.582093
4909	141	2026-03-05	5	4	1	t	800	15.619253	68	28	2026-03-31 06:08:34.584166
4910	141	2026-03-06	5	5	0	t	1000	19.598051	85	35	2026-03-31 06:08:34.586099
4911	141	2026-03-07	5	4	1	t	800	16.405346	68	28	2026-03-31 06:08:34.58848
4912	141	2026-03-08	5	5	0	t	1000	18.49697	85	35	2026-03-31 06:08:34.59081
4913	141	2026-03-09	5	5	0	t	1000	18.498104	85	35	2026-03-31 06:08:34.593153
4914	141	2026-03-10	5	4	1	t	800	17.34456	68	28	2026-03-31 06:08:34.595731
4915	141	2026-03-11	5	4	1	t	800	17.328167	68	28	2026-03-31 06:08:34.597895
4916	141	2026-03-12	5	5	0	t	1000	19.005554	85	35	2026-03-31 06:08:34.599943
4917	141	2026-03-13	5	4	1	t	800	15.912197	68	28	2026-03-31 06:08:34.602358
4918	141	2026-03-14	5	5	0	t	1000	21.374588	85	35	2026-03-31 06:08:34.605191
4919	141	2026-03-15	5	4	1	t	800	16.448273	68	28	2026-03-31 06:08:34.607673
4920	141	2026-03-16	5	5	0	t	1000	19.046522	85	35	2026-03-31 06:08:34.61021
4921	141	2026-03-17	5	4	1	t	800	14.413742	68	28	2026-03-31 06:08:34.612299
4922	141	2026-03-18	5	5	0	t	1000	18.465921	85	35	2026-03-31 06:08:34.614312
4923	141	2026-03-19	5	4	1	t	800	17.584663	68	28	2026-03-31 06:08:34.616616
4924	141	2026-03-20	5	5	0	t	1000	20.994347	85	35	2026-03-31 06:08:34.618545
4925	141	2026-03-21	5	5	0	t	1000	18.13536	85	35	2026-03-31 06:08:34.620953
4926	141	2026-03-22	5	5	0	t	1000	19.718872	85	35	2026-03-31 06:08:34.623341
4927	141	2026-03-23	5	5	0	t	1000	21.268793	85	35	2026-03-31 06:08:34.625848
4928	141	2026-03-24	5	5	0	t	1000	19.315664	85	35	2026-03-31 06:08:34.628404
4929	141	2026-03-25	5	4	1	t	800	15.678777	68	28	2026-03-31 06:08:34.631266
4930	141	2026-03-26	5	5	0	t	1000	19.578646	85	35	2026-03-31 06:08:34.633635
4931	141	2026-03-27	5	4	1	t	800	16.154089	68	28	2026-03-31 06:08:34.635948
4932	141	2026-03-28	5	5	0	t	1000	19.586195	85	35	2026-03-31 06:08:34.637995
4933	141	2026-03-29	5	5	0	t	1000	20.525768	85	35	2026-03-31 06:08:34.64114
4934	141	2026-03-30	5	5	0	t	1000	20.00057	85	35	2026-03-31 06:08:34.643386
4935	141	2026-03-31	5	5	0	t	1000	20.957237	85	35	2026-03-31 06:08:34.645552
4936	142	2026-02-25	5	2	3	f	640	17.48797	54	20	2026-03-31 06:08:34.710636
4937	142	2026-02-26	5	3	2	f	960	24.802633	81	30	2026-03-31 06:08:34.713372
4938	142	2026-02-27	5	3	2	f	960	23.919115	81	30	2026-03-31 06:08:34.715596
4939	142	2026-02-28	5	3	2	f	960	27.072714	81	30	2026-03-31 06:08:34.718272
4940	142	2026-03-01	5	3	2	f	960	27.623955	81	30	2026-03-31 06:08:34.7204
4941	142	2026-03-02	5	3	2	f	960	26.39175	81	30	2026-03-31 06:08:34.722926
4942	142	2026-03-03	5	3	2	f	960	26.302994	81	30	2026-03-31 06:08:34.725749
4943	142	2026-03-04	5	3	2	f	960	24.99433	81	30	2026-03-31 06:08:34.727903
4944	142	2026-03-05	5	2	3	f	640	16.129398	54	20	2026-03-31 06:08:34.730893
4945	142	2026-03-06	5	3	2	f	960	25.440235	81	30	2026-03-31 06:08:34.733212
4946	142	2026-03-07	5	3	2	f	960	25.50066	81	30	2026-03-31 06:08:34.73537
4947	142	2026-03-08	5	3	2	t	960	25.301498	81	30	2026-03-31 06:08:34.738023
4948	142	2026-03-09	5	3	2	t	960	24.159891	81	30	2026-03-31 06:08:34.739997
4949	142	2026-03-10	5	3	2	t	960	25.781721	81	30	2026-03-31 06:08:34.741974
4950	142	2026-03-11	5	3	2	t	960	23.685032	81	30	2026-03-31 06:08:34.744166
4951	142	2026-03-12	5	3	2	t	960	25.368832	81	30	2026-03-31 06:08:34.746669
4952	142	2026-03-13	5	3	2	t	960	26.244774	81	30	2026-03-31 06:08:34.748749
4953	142	2026-03-14	5	3	2	t	960	24.349594	81	30	2026-03-31 06:08:34.75115
4954	142	2026-03-15	5	3	2	t	960	24.021204	81	30	2026-03-31 06:08:34.752921
4955	142	2026-03-16	5	3	2	t	960	25.919239	81	30	2026-03-31 06:08:34.755262
4956	142	2026-03-17	5	3	2	t	960	24.760372	81	30	2026-03-31 06:08:34.757075
4957	142	2026-03-18	5	3	2	t	960	23.780874	81	30	2026-03-31 06:08:34.759502
4958	142	2026-03-19	5	3	2	t	960	24.040049	81	30	2026-03-31 06:08:34.761882
4959	142	2026-03-20	5	2	3	t	640	19.092463	54	20	2026-03-31 06:08:34.763809
4960	142	2026-03-21	5	3	2	t	960	25.833662	81	30	2026-03-31 06:08:34.7663
4961	142	2026-03-22	5	3	2	t	960	23.795229	81	30	2026-03-31 06:08:34.768406
4962	142	2026-03-23	5	3	2	t	960	26.960535	81	30	2026-03-31 06:08:34.77037
4963	142	2026-03-24	5	3	2	t	960	26.346136	81	30	2026-03-31 06:08:34.772552
4964	142	2026-03-25	5	3	2	t	960	24.484383	81	30	2026-03-31 06:08:34.77461
4965	142	2026-03-26	5	3	2	t	960	27.424744	81	30	2026-03-31 06:08:34.777133
4966	142	2026-03-27	5	3	2	t	960	26.404	81	30	2026-03-31 06:08:34.779247
4967	142	2026-03-28	5	3	2	t	960	25.751644	81	30	2026-03-31 06:08:34.781385
4968	142	2026-03-29	5	3	2	t	960	24.426298	81	30	2026-03-31 06:08:34.78347
4969	142	2026-03-30	5	2	3	t	640	19.218924	54	20	2026-03-31 06:08:34.786298
4970	142	2026-03-31	5	3	2	t	960	26.57847	81	30	2026-03-31 06:08:34.78889
4971	143	2026-02-25	5	2	3	f	400	7.5526643	34	14	2026-03-31 06:08:34.852356
4972	143	2026-02-26	5	2	3	f	400	8.511175	34	14	2026-03-31 06:08:34.854598
4973	143	2026-02-27	5	2	3	f	400	9.959197	34	14	2026-03-31 06:08:34.857087
4974	143	2026-02-28	5	2	3	f	400	8.017802	34	14	2026-03-31 06:08:34.859677
4975	143	2026-03-01	5	2	3	f	400	6.3326125	34	14	2026-03-31 06:08:34.862339
4976	143	2026-03-02	5	1	4	f	200	3.422099	17	7	2026-03-31 06:08:34.864523
4977	143	2026-03-03	5	2	3	f	400	6.7611804	34	14	2026-03-31 06:08:34.867197
4978	143	2026-03-04	5	2	3	f	400	7.9616766	34	14	2026-03-31 06:08:34.869356
4979	143	2026-03-05	5	2	3	f	400	8.535741	34	14	2026-03-31 06:08:34.8717
4980	143	2026-03-06	5	1	4	f	200	5.9140773	17	7	2026-03-31 06:08:34.873897
4981	143	2026-03-07	5	1	4	f	200	5.221818	17	7	2026-03-31 06:08:34.876034
4982	143	2026-03-08	5	1	4	f	200	4.697042	17	7	2026-03-31 06:08:34.878123
4983	143	2026-03-09	5	2	3	f	400	8.803286	34	14	2026-03-31 06:08:34.88028
4984	143	2026-03-10	5	2	3	f	400	9.888377	34	14	2026-03-31 06:08:34.882847
4985	143	2026-03-11	5	2	3	f	400	8.356303	34	14	2026-03-31 06:08:34.88536
4986	143	2026-03-12	5	2	3	f	400	8.892139	34	14	2026-03-31 06:08:34.887453
4987	143	2026-03-13	5	2	3	f	400	6.3391485	34	14	2026-03-31 06:08:34.890196
4988	143	2026-03-14	5	2	3	f	400	9.537608	34	14	2026-03-31 06:08:34.892376
4989	143	2026-03-15	5	2	3	f	400	7.824155	34	14	2026-03-31 06:08:34.895009
4990	143	2026-03-16	5	1	4	f	200	3.6014047	17	7	2026-03-31 06:08:34.897269
4991	143	2026-03-17	5	2	3	t	400	9.429019	34	14	2026-03-31 06:08:34.899818
4992	143	2026-03-18	5	1	4	t	200	6.4759364	17	7	2026-03-31 06:08:34.902314
4993	143	2026-03-19	5	1	4	t	200	2.5985582	17	7	2026-03-31 06:08:34.905438
4994	143	2026-03-20	5	1	4	t	200	6.358466	17	7	2026-03-31 06:08:34.907968
4995	143	2026-03-21	5	2	3	t	400	8.663975	34	14	2026-03-31 06:08:34.910444
4996	143	2026-03-22	5	2	3	t	400	7.033966	34	14	2026-03-31 06:08:34.912714
4997	143	2026-03-23	5	2	3	t	400	10.115375	34	14	2026-03-31 06:08:34.914875
4998	143	2026-03-24	5	2	3	t	400	8.911237	34	14	2026-03-31 06:08:34.917104
4999	143	2026-03-25	5	2	3	t	400	6.714417	34	14	2026-03-31 06:08:34.919612
5000	143	2026-03-26	5	2	3	t	400	10.216731	34	14	2026-03-31 06:08:34.921565
5001	143	2026-03-27	5	1	4	t	200	3.0315602	17	7	2026-03-31 06:08:34.923675
5002	143	2026-03-28	5	2	3	t	400	7.3069353	34	14	2026-03-31 06:08:34.926204
5003	143	2026-03-29	5	1	4	t	200	3.1958508	17	7	2026-03-31 06:08:34.928381
5004	143	2026-03-30	5	2	3	t	400	10.0523815	34	14	2026-03-31 06:08:34.930333
5005	143	2026-03-31	5	2	3	t	400	9.584361	34	14	2026-03-31 06:08:34.932267
5006	144	2026-02-25	5	5	0	f	1200	17.613316	100	40	2026-03-31 06:08:34.993203
5007	144	2026-02-26	5	4	1	f	960	11.717738	80	32	2026-03-31 06:08:34.995554
5008	144	2026-02-27	5	4	1	t	960	11.394395	80	32	2026-03-31 06:08:34.997569
5009	144	2026-02-28	5	5	0	t	1200	14.184596	100	40	2026-03-31 06:08:35.000259
5010	144	2026-03-01	5	4	1	t	960	12.822965	80	32	2026-03-31 06:08:35.002342
5011	144	2026-03-02	5	4	1	t	960	11.3440275	80	32	2026-03-31 06:08:35.00461
5012	144	2026-03-03	5	4	1	t	960	14.342281	80	32	2026-03-31 06:08:35.006607
5013	144	2026-03-04	5	4	1	t	960	11.072926	80	32	2026-03-31 06:08:35.008919
5014	144	2026-03-05	5	4	1	t	960	13.181835	80	32	2026-03-31 06:08:35.011699
5015	144	2026-03-06	5	4	1	t	960	12.098784	80	32	2026-03-31 06:08:35.014156
5016	144	2026-03-07	5	4	1	t	960	12.975585	80	32	2026-03-31 06:08:35.016015
5017	144	2026-03-08	5	4	1	t	960	11.715731	80	32	2026-03-31 06:08:35.018626
5018	144	2026-03-09	5	4	1	t	960	14.434842	80	32	2026-03-31 06:08:35.020498
5019	144	2026-03-10	5	4	1	t	960	13.498759	80	32	2026-03-31 06:08:35.022848
5020	144	2026-03-11	5	4	1	t	960	11.75613	80	32	2026-03-31 06:08:35.024854
5021	144	2026-03-12	5	4	1	t	960	12.699913	80	32	2026-03-31 06:08:35.027386
5022	144	2026-03-13	5	4	1	t	960	12.122174	80	32	2026-03-31 06:08:35.029718
5023	144	2026-03-14	5	4	1	t	960	14.726054	80	32	2026-03-31 06:08:35.033496
5024	144	2026-03-15	5	4	1	t	960	12.921275	80	32	2026-03-31 06:08:35.036582
5025	144	2026-03-16	5	4	1	t	960	13.181723	80	32	2026-03-31 06:08:35.040167
5026	144	2026-03-17	5	4	1	t	960	12.722989	80	32	2026-03-31 06:08:35.051627
5027	144	2026-03-18	5	4	1	t	960	13.179613	80	32	2026-03-31 06:08:35.055052
5028	144	2026-03-19	5	4	1	t	960	10.996343	80	32	2026-03-31 06:08:35.057771
5029	144	2026-03-20	5	4	1	t	960	13.632414	80	32	2026-03-31 06:08:35.06133
5030	144	2026-03-21	5	4	1	t	960	12.551276	80	32	2026-03-31 06:08:35.064573
5031	144	2026-03-22	5	4	1	t	960	12.819405	80	32	2026-03-31 06:08:35.068015
5032	144	2026-03-23	5	4	1	t	960	14.107207	80	32	2026-03-31 06:08:35.071209
5033	144	2026-03-24	5	4	1	t	960	11.343398	80	32	2026-03-31 06:08:35.075131
5034	144	2026-03-25	5	4	1	t	960	14.399401	80	32	2026-03-31 06:08:35.078225
5035	144	2026-03-26	5	4	1	t	960	14.400039	80	32	2026-03-31 06:08:35.081849
5036	144	2026-03-27	5	4	1	t	960	12.5254755	80	32	2026-03-31 06:08:35.084118
5037	144	2026-03-28	5	4	1	t	960	12.879046	80	32	2026-03-31 06:08:35.086579
5038	144	2026-03-29	5	5	0	t	1200	13.828759	100	40	2026-03-31 06:08:35.091089
5039	144	2026-03-30	5	5	0	t	1200	17.258533	100	40	2026-03-31 06:08:35.093487
5040	144	2026-03-31	5	4	1	t	960	11.041441	80	32	2026-03-31 06:08:35.096232
5041	145	2026-02-25	5	2	3	f	560	17.807032	48	18	2026-03-31 06:08:35.177265
5042	145	2026-02-26	5	3	2	f	840	25.918768	72	27	2026-03-31 06:08:35.179895
5043	145	2026-02-27	5	2	3	f	560	15.114381	48	18	2026-03-31 06:08:35.182511
5044	145	2026-02-28	5	2	3	f	560	17.265078	48	18	2026-03-31 06:08:35.188428
5045	145	2026-03-01	5	3	2	f	840	24.162544	72	27	2026-03-31 06:08:35.190401
5046	145	2026-03-02	5	2	3	f	560	16.459106	48	18	2026-03-31 06:08:35.192624
5047	145	2026-03-03	5	3	2	f	840	26.567356	72	27	2026-03-31 06:08:35.19497
5048	145	2026-03-04	5	2	3	f	560	17.120804	48	18	2026-03-31 06:08:35.197573
5049	145	2026-03-05	5	2	3	f	560	15.457742	48	18	2026-03-31 06:08:35.199847
5050	145	2026-03-06	5	2	3	f	560	15.912294	48	18	2026-03-31 06:08:35.202406
5051	145	2026-03-07	5	2	3	f	560	16.446821	48	18	2026-03-31 06:08:35.204737
5052	145	2026-03-08	5	2	3	f	560	16.652927	48	18	2026-03-31 06:08:35.207024
5053	145	2026-03-09	5	2	3	f	560	14.9694395	48	18	2026-03-31 06:08:35.208938
5054	145	2026-03-10	5	2	3	f	560	17.9882	48	18	2026-03-31 06:08:35.21116
5055	145	2026-03-11	5	3	2	f	840	25.337654	72	27	2026-03-31 06:08:35.213165
5056	145	2026-03-12	5	3	2	f	840	26.58217	72	27	2026-03-31 06:08:35.215467
5057	145	2026-03-13	5	3	2	t	840	25.756401	72	27	2026-03-31 06:08:35.217584
5058	145	2026-03-14	5	2	3	t	560	16.49748	48	18	2026-03-31 06:08:35.220692
5059	145	2026-03-15	5	2	3	t	560	18.218153	48	18	2026-03-31 06:08:35.222708
5060	145	2026-03-16	5	3	2	t	840	24.376514	72	27	2026-03-31 06:08:35.224917
5061	145	2026-03-17	5	2	3	t	560	15.46994	48	18	2026-03-31 06:08:35.227427
5062	145	2026-03-18	5	2	3	t	560	17.136372	48	18	2026-03-31 06:08:35.229803
5063	145	2026-03-19	5	2	3	t	560	16.66163	48	18	2026-03-31 06:08:35.232284
5064	145	2026-03-20	5	3	2	t	840	25.335514	72	27	2026-03-31 06:08:35.23456
5065	145	2026-03-21	5	2	3	t	560	15.116215	48	18	2026-03-31 06:08:35.237262
5066	145	2026-03-22	5	2	3	t	560	14.893623	48	18	2026-03-31 06:08:35.239177
5067	145	2026-03-23	5	3	2	t	840	23.963354	72	27	2026-03-31 06:08:35.241578
5068	145	2026-03-24	5	2	3	t	560	16.313862	48	18	2026-03-31 06:08:35.243895
5069	145	2026-03-25	5	2	3	t	560	16.80867	48	18	2026-03-31 06:08:35.247053
5070	145	2026-03-26	5	2	3	t	560	15.701673	48	18	2026-03-31 06:08:35.249155
5071	145	2026-03-27	5	2	3	t	560	14.975653	48	18	2026-03-31 06:08:35.251145
5072	145	2026-03-28	5	2	3	t	560	15.047161	48	18	2026-03-31 06:08:35.253319
5073	145	2026-03-29	5	3	2	t	840	24.99852	72	27	2026-03-31 06:08:35.255525
5074	145	2026-03-30	5	2	3	t	560	16.75536	48	18	2026-03-31 06:08:35.257725
5075	145	2026-03-31	5	3	2	t	840	23.665588	72	27	2026-03-31 06:08:35.260373
5076	146	2026-02-25	5	3	2	f	960	10.418133	81	30	2026-03-31 06:08:35.322721
5077	146	2026-02-26	5	4	1	f	1280	14.7092495	108	40	2026-03-31 06:08:35.324798
5078	146	2026-02-27	5	4	1	f	1280	13.818761	108	40	2026-03-31 06:08:35.327111
5079	146	2026-02-28	5	3	2	f	960	11.114796	81	30	2026-03-31 06:08:35.329408
5080	146	2026-03-01	5	4	1	f	1280	11.406415	108	40	2026-03-31 06:08:35.331639
5081	146	2026-03-02	5	4	1	t	1280	12.523224	108	40	2026-03-31 06:08:35.333597
5082	146	2026-03-03	5	4	1	t	1280	12.414283	108	40	2026-03-31 06:08:35.335523
5083	146	2026-03-04	5	4	1	t	1280	13.856583	108	40	2026-03-31 06:08:35.337606
5084	146	2026-03-05	5	3	2	t	960	11.527723	81	30	2026-03-31 06:08:35.339662
5085	146	2026-03-06	5	3	2	t	960	10.648662	81	30	2026-03-31 06:08:35.341582
5086	146	2026-03-07	5	3	2	t	960	9.6455555	81	30	2026-03-31 06:08:35.343905
5087	146	2026-03-08	5	4	1	t	1280	12.583144	108	40	2026-03-31 06:08:35.346375
5088	146	2026-03-09	5	4	1	t	1280	12.228893	108	40	2026-03-31 06:08:35.348351
5089	146	2026-03-10	5	4	1	t	1280	12.218332	108	40	2026-03-31 06:08:35.350654
5090	146	2026-03-11	5	4	1	t	1280	12.523363	108	40	2026-03-31 06:08:35.353026
5091	146	2026-03-12	5	3	2	t	960	8.53353	81	30	2026-03-31 06:08:35.355469
5092	146	2026-03-13	5	4	1	t	1280	12.326596	108	40	2026-03-31 06:08:35.357728
5093	146	2026-03-14	5	3	2	t	960	10.060644	81	30	2026-03-31 06:08:35.360124
5094	146	2026-03-15	5	3	2	t	960	11.453183	81	30	2026-03-31 06:08:35.362079
5095	146	2026-03-16	5	4	1	t	1280	11.586387	108	40	2026-03-31 06:08:35.364064
5096	146	2026-03-17	5	4	1	t	1280	13.869282	108	40	2026-03-31 06:08:35.366375
5097	146	2026-03-18	5	3	2	t	960	10.042044	81	30	2026-03-31 06:08:35.369552
5098	146	2026-03-19	5	3	2	t	960	10.17627	81	30	2026-03-31 06:08:35.372419
5099	146	2026-03-20	5	4	1	t	1280	13.797537	108	40	2026-03-31 06:08:35.374892
5100	146	2026-03-21	5	4	1	t	1280	14.225487	108	40	2026-03-31 06:08:35.377545
5101	146	2026-03-22	5	4	1	t	1280	14.253759	108	40	2026-03-31 06:08:35.379773
5102	146	2026-03-23	5	3	2	t	960	11.121443	81	30	2026-03-31 06:08:35.381772
5103	146	2026-03-24	5	4	1	t	1280	14.666454	108	40	2026-03-31 06:08:35.383917
5104	146	2026-03-25	5	3	2	t	960	11.117596	81	30	2026-03-31 06:08:35.385964
5105	146	2026-03-26	5	3	2	t	960	10.220301	81	30	2026-03-31 06:08:35.388946
5106	146	2026-03-27	5	4	1	t	1280	11.523967	108	40	2026-03-31 06:08:35.391245
5107	146	2026-03-28	5	4	1	t	1280	13.504548	108	40	2026-03-31 06:08:35.39354
5108	146	2026-03-29	5	4	1	t	1280	10.8081875	108	40	2026-03-31 06:08:35.396068
5109	146	2026-03-30	5	3	2	t	960	10.026183	81	30	2026-03-31 06:08:35.398211
5110	146	2026-03-31	5	4	1	t	1280	10.83121	108	40	2026-03-31 06:08:35.400467
5111	147	2026-02-25	5	2	3	f	480	18.72653	40	16	2026-03-31 06:08:35.460919
5112	147	2026-02-26	5	3	2	f	720	29.688452	60	24	2026-03-31 06:08:35.463095
5113	147	2026-02-27	5	2	3	f	480	20.357723	40	16	2026-03-31 06:08:35.465925
5114	147	2026-02-28	5	2	3	f	480	18.718487	40	16	2026-03-31 06:08:35.467857
5115	147	2026-03-01	5	3	2	f	720	29.189716	60	24	2026-03-31 06:08:35.470364
5116	147	2026-03-02	5	3	2	f	720	26.749975	60	24	2026-03-31 06:08:35.472503
5117	147	2026-03-03	5	2	3	f	480	18.556822	40	16	2026-03-31 06:08:35.475387
5118	147	2026-03-04	5	3	2	f	720	28.966146	60	24	2026-03-31 06:08:35.477623
5119	147	2026-03-05	5	3	2	f	720	30.048267	60	24	2026-03-31 06:08:35.48003
5120	147	2026-03-06	5	3	2	f	720	28.435717	60	24	2026-03-31 06:08:35.482412
5121	147	2026-03-07	5	2	3	f	480	17.553228	40	16	2026-03-31 06:08:35.484871
5122	147	2026-03-08	5	2	3	f	480	19.630337	40	16	2026-03-31 06:08:35.486908
5123	147	2026-03-09	5	3	2	f	720	26.77352	60	24	2026-03-31 06:08:35.489395
5124	147	2026-03-10	5	3	2	t	720	26.7549	60	24	2026-03-31 06:08:35.491579
5125	147	2026-03-11	5	3	2	t	720	27.690977	60	24	2026-03-31 06:08:35.493739
5126	147	2026-03-12	5	3	2	t	720	26.63906	60	24	2026-03-31 06:08:35.496283
5127	147	2026-03-13	5	2	3	t	480	18.675173	40	16	2026-03-31 06:08:35.498352
5128	147	2026-03-14	5	2	3	t	480	19.73648	40	16	2026-03-31 06:08:35.500628
5129	147	2026-03-15	5	3	2	t	720	30.359648	60	24	2026-03-31 06:08:35.503519
5130	147	2026-03-16	5	2	3	t	480	18.754808	40	16	2026-03-31 06:08:35.50567
5131	147	2026-03-17	5	2	3	t	480	18.791063	40	16	2026-03-31 06:08:35.508281
5132	147	2026-03-18	5	2	3	t	480	18.085169	40	16	2026-03-31 06:08:35.510312
5133	147	2026-03-19	5	2	3	t	480	17.63418	40	16	2026-03-31 06:08:35.512894
5134	147	2026-03-20	5	3	2	t	720	29.379366	60	24	2026-03-31 06:08:35.515254
5135	147	2026-03-21	5	3	2	t	720	27.297709	60	24	2026-03-31 06:08:35.517305
5136	147	2026-03-22	5	3	2	t	720	27.88853	60	24	2026-03-31 06:08:35.519221
5137	147	2026-03-23	5	2	3	t	480	20.063343	40	16	2026-03-31 06:08:35.521301
5138	147	2026-03-24	5	2	3	t	480	20.519772	40	16	2026-03-31 06:08:35.523767
5139	147	2026-03-25	5	3	2	t	720	28.016878	60	24	2026-03-31 06:08:35.526244
5140	147	2026-03-26	5	2	3	t	480	20.302244	40	16	2026-03-31 06:08:35.529176
5141	147	2026-03-27	5	3	2	t	720	29.415068	60	24	2026-03-31 06:08:35.531616
5142	147	2026-03-28	5	3	2	t	720	28.929047	60	24	2026-03-31 06:08:35.533632
5143	147	2026-03-29	5	3	2	t	720	28.87685	60	24	2026-03-31 06:08:35.536204
5144	147	2026-03-30	5	3	2	t	720	27.847397	60	24	2026-03-31 06:08:35.538432
5145	147	2026-03-31	5	3	2	t	720	28.916075	60	24	2026-03-31 06:08:35.540461
5146	148	2026-02-25	5	5	0	t	1000	21.080606	85	35	2026-03-31 06:08:35.606267
5147	148	2026-02-26	5	5	0	t	1000	18.39899	85	35	2026-03-31 06:08:35.608598
5148	148	2026-02-27	5	5	0	t	1000	20.165585	85	35	2026-03-31 06:08:35.610848
5149	148	2026-02-28	5	4	1	t	800	16.348368	68	28	2026-03-31 06:08:35.613358
5150	148	2026-03-01	5	5	0	t	1000	19.632322	85	35	2026-03-31 06:08:35.615308
5151	148	2026-03-02	5	5	0	t	1000	18.17031	85	35	2026-03-31 06:08:35.617809
5152	148	2026-03-03	5	4	1	t	800	15.537681	68	28	2026-03-31 06:08:35.620034
5153	148	2026-03-04	5	4	1	t	800	15.609613	68	28	2026-03-31 06:08:35.622766
5154	148	2026-03-05	5	4	1	t	800	15.190811	68	28	2026-03-31 06:08:35.625138
5155	148	2026-03-06	5	4	1	t	800	14.285849	68	28	2026-03-31 06:08:35.627153
5156	148	2026-03-07	5	5	0	t	1000	19.514194	85	35	2026-03-31 06:08:35.62906
5157	148	2026-03-08	5	5	0	t	1000	20.358034	85	35	2026-03-31 06:08:35.631129
5158	148	2026-03-09	5	4	1	t	800	16.920158	68	28	2026-03-31 06:08:35.633625
5159	148	2026-03-10	5	5	0	t	1000	18.233446	85	35	2026-03-31 06:08:35.636524
5160	148	2026-03-11	5	5	0	t	1000	20.040966	85	35	2026-03-31 06:08:35.638479
5161	148	2026-03-12	5	4	1	t	800	14.554918	68	28	2026-03-31 06:08:35.640891
5162	148	2026-03-13	5	4	1	t	800	16.4949	68	28	2026-03-31 06:08:35.642944
5163	148	2026-03-14	5	5	0	t	1000	18.729849	85	35	2026-03-31 06:08:35.64544
5164	148	2026-03-15	5	5	0	t	1000	19.524471	85	35	2026-03-31 06:08:35.64759
5165	148	2026-03-16	5	5	0	t	1000	19.821194	85	35	2026-03-31 06:08:35.649542
5166	148	2026-03-17	5	5	0	t	1000	20.840485	85	35	2026-03-31 06:08:35.651468
5167	148	2026-03-18	5	5	0	t	1000	20.13734	85	35	2026-03-31 06:08:35.653693
5168	148	2026-03-19	5	5	0	t	1000	17.767294	85	35	2026-03-31 06:08:35.655709
5169	148	2026-03-20	5	5	0	t	1000	18.96519	85	35	2026-03-31 06:08:35.658191
5170	148	2026-03-21	5	4	1	t	800	17.613695	68	28	2026-03-31 06:08:35.660794
5171	148	2026-03-22	5	5	0	t	1000	18.736614	85	35	2026-03-31 06:08:35.663308
5172	148	2026-03-23	5	4	1	t	800	14.992093	68	28	2026-03-31 06:08:35.665417
5173	148	2026-03-24	5	5	0	t	1000	20.183655	85	35	2026-03-31 06:08:35.667592
5174	148	2026-03-25	5	5	0	t	1000	18.441654	85	35	2026-03-31 06:08:35.66987
5175	148	2026-03-26	5	5	0	t	1000	21.16044	85	35	2026-03-31 06:08:35.672539
5176	148	2026-03-27	5	5	0	t	1000	21.21111	85	35	2026-03-31 06:08:35.674863
5177	148	2026-03-28	5	5	0	t	1000	19.906849	85	35	2026-03-31 06:08:35.676971
5178	148	2026-03-29	5	5	0	t	1000	17.72704	85	35	2026-03-31 06:08:35.679416
5179	148	2026-03-30	5	4	1	t	800	16.09415	68	28	2026-03-31 06:08:35.681428
5180	148	2026-03-31	5	5	0	t	1000	21.37923	85	35	2026-03-31 06:08:35.683751
5181	149	2026-02-25	5	2	3	f	400	33.4778	34	14	2026-03-31 06:08:35.759603
5182	149	2026-02-26	5	2	3	f	400	30.703398	34	14	2026-03-31 06:08:35.761648
5183	149	2026-02-27	5	2	3	f	400	33.614006	34	14	2026-03-31 06:08:35.764416
5184	149	2026-02-28	5	2	3	f	400	32.45604	34	14	2026-03-31 06:08:35.766395
5185	149	2026-03-01	5	2	3	f	400	31.20749	34	14	2026-03-31 06:08:35.768654
5186	149	2026-03-02	5	2	3	f	400	31.772015	34	14	2026-03-31 06:08:35.77076
5187	149	2026-03-03	5	2	3	f	400	31.844566	34	14	2026-03-31 06:08:35.77289
5188	149	2026-03-04	5	2	3	f	400	31.66952	34	14	2026-03-31 06:08:35.774786
5189	149	2026-03-05	5	2	3	f	400	32.056755	34	14	2026-03-31 06:08:35.777224
5190	149	2026-03-06	5	2	3	f	400	34.139465	34	14	2026-03-31 06:08:35.779101
5191	149	2026-03-07	5	2	3	f	400	32.052597	34	14	2026-03-31 06:08:35.78147
5192	149	2026-03-08	5	2	3	f	400	30.887907	34	14	2026-03-31 06:08:35.783928
5193	149	2026-03-09	5	2	3	f	400	31.987303	34	14	2026-03-31 06:08:35.786246
5194	149	2026-03-10	5	2	3	f	400	31.820263	34	14	2026-03-31 06:08:35.788111
5195	149	2026-03-11	5	2	3	f	400	31.68251	34	14	2026-03-31 06:08:35.790356
5196	149	2026-03-12	5	2	3	f	400	33.58712	34	14	2026-03-31 06:08:35.793056
5197	149	2026-03-13	5	2	3	f	400	30.951048	34	14	2026-03-31 06:08:35.795064
5198	149	2026-03-14	5	2	3	f	400	30.87037	34	14	2026-03-31 06:08:35.79706
5199	149	2026-03-15	5	2	3	t	400	30.680496	34	14	2026-03-31 06:08:35.799491
5200	149	2026-03-16	5	2	3	t	400	31.333168	34	14	2026-03-31 06:08:35.801889
5201	149	2026-03-17	5	1	4	t	200	16.073637	17	7	2026-03-31 06:08:35.804262
5202	149	2026-03-18	5	2	3	t	400	33.20918	34	14	2026-03-31 06:08:35.806688
5203	149	2026-03-19	5	2	3	t	400	32.3668	34	14	2026-03-31 06:08:35.80919
5204	149	2026-03-20	5	2	3	t	400	33.99575	34	14	2026-03-31 06:08:35.811263
5205	149	2026-03-21	5	1	4	t	200	16.247328	17	7	2026-03-31 06:08:35.813899
5206	149	2026-03-22	5	2	3	t	400	31.834581	34	14	2026-03-31 06:08:35.816089
5207	149	2026-03-23	5	2	3	t	400	33.412212	34	14	2026-03-31 06:08:35.818251
5208	149	2026-03-24	5	2	3	t	400	31.96986	34	14	2026-03-31 06:08:35.820283
5209	149	2026-03-25	5	2	3	t	400	33.428772	34	14	2026-03-31 06:08:35.822364
5210	149	2026-03-26	5	1	4	t	200	15.687482	17	7	2026-03-31 06:08:35.824715
5211	149	2026-03-27	5	2	3	t	400	31.821396	34	14	2026-03-31 06:08:35.827214
5212	149	2026-03-28	5	2	3	t	400	31.972115	34	14	2026-03-31 06:08:35.829574
5213	149	2026-03-29	5	2	3	t	400	33.642925	34	14	2026-03-31 06:08:35.831619
5214	149	2026-03-30	5	1	4	t	200	17.810743	17	7	2026-03-31 06:08:35.833633
5215	149	2026-03-31	5	2	3	t	400	33.70808	34	14	2026-03-31 06:08:35.835745
5216	150	2026-02-25	5	3	2	f	840	9.440691	72	27	2026-03-31 06:08:35.896037
5217	150	2026-02-26	5	3	2	f	840	8.26914	72	27	2026-03-31 06:08:35.89847
5218	150	2026-02-27	5	3	2	f	840	6.0869546	72	27	2026-03-31 06:08:35.900411
5219	150	2026-02-28	5	3	2	f	840	7.499597	72	27	2026-03-31 06:08:35.902943
5220	150	2026-03-01	5	3	2	f	840	7.3081636	72	27	2026-03-31 06:08:35.90481
5221	150	2026-03-02	5	3	2	f	840	7.247419	72	27	2026-03-31 06:08:35.907834
5222	150	2026-03-03	5	3	2	f	840	6.9510846	72	27	2026-03-31 06:08:35.909778
5223	150	2026-03-04	5	3	2	f	840	8.040445	72	27	2026-03-31 06:08:35.912457
5224	150	2026-03-05	5	4	1	f	1120	7.880007	96	36	2026-03-31 06:08:35.914947
5225	150	2026-03-06	5	3	2	t	840	8.093673	72	27	2026-03-31 06:08:35.917307
5226	150	2026-03-07	5	3	2	t	840	7.667324	72	27	2026-03-31 06:08:35.919687
5227	150	2026-03-08	5	3	2	t	840	5.7215657	72	27	2026-03-31 06:08:35.92327
5228	150	2026-03-09	5	3	2	t	840	7.8244452	72	27	2026-03-31 06:08:35.925528
5229	150	2026-03-10	5	3	2	t	840	6.42718	72	27	2026-03-31 06:08:35.927643
5230	150	2026-03-11	5	3	2	t	840	6.222405	72	27	2026-03-31 06:08:35.930011
5231	150	2026-03-12	5	3	2	t	840	8.364009	72	27	2026-03-31 06:08:35.93239
5232	150	2026-03-13	5	3	2	t	840	6.5837817	72	27	2026-03-31 06:08:35.934551
5233	150	2026-03-14	5	3	2	t	840	6.9948726	72	27	2026-03-31 06:08:35.936929
5234	150	2026-03-15	5	3	2	t	840	7.217721	72	27	2026-03-31 06:08:35.939413
5235	150	2026-03-16	5	3	2	t	840	5.9862704	72	27	2026-03-31 06:08:35.941679
5236	150	2026-03-17	5	3	2	t	840	8.21524	72	27	2026-03-31 06:08:35.9435
5237	150	2026-03-18	5	3	2	t	840	5.889589	72	27	2026-03-31 06:08:35.945871
5238	150	2026-03-19	5	3	2	t	840	8.395867	72	27	2026-03-31 06:08:35.947796
5239	150	2026-03-20	5	3	2	t	840	7.197185	72	27	2026-03-31 06:08:35.949802
5240	150	2026-03-21	5	3	2	t	840	7.6762347	72	27	2026-03-31 06:08:35.951814
5241	150	2026-03-22	5	3	2	t	840	6.7187467	72	27	2026-03-31 06:08:35.954184
5242	150	2026-03-23	5	3	2	t	840	6.608687	72	27	2026-03-31 06:08:35.956157
5243	150	2026-03-24	5	3	2	t	840	7.0407166	72	27	2026-03-31 06:08:35.958504
5244	150	2026-03-25	5	3	2	t	840	9.271284	72	27	2026-03-31 06:08:35.961178
5245	150	2026-03-26	5	4	1	t	1120	11.271345	96	36	2026-03-31 06:08:35.963436
5246	150	2026-03-27	5	3	2	t	840	8.423668	72	27	2026-03-31 06:08:35.966482
5247	150	2026-03-28	5	3	2	t	840	8.35226	72	27	2026-03-31 06:08:35.96905
5248	150	2026-03-29	5	4	1	t	1120	9.758046	96	36	2026-03-31 06:08:35.971055
5249	150	2026-03-30	5	3	2	t	840	6.041079	72	27	2026-03-31 06:08:35.973179
5250	150	2026-03-31	5	3	2	t	840	8.855676	72	27	2026-03-31 06:08:35.975238
5251	151	2026-02-25	5	5	0	f	1200	17.01775	100	40	2026-03-31 06:08:36.034845
5252	151	2026-02-26	5	4	1	t	960	12.844706	80	32	2026-03-31 06:08:36.037014
5253	151	2026-02-27	5	4	1	t	960	12.908113	80	32	2026-03-31 06:08:36.039819
5254	151	2026-02-28	5	4	1	t	960	11.538976	80	32	2026-03-31 06:08:36.042773
5255	151	2026-03-01	5	4	1	t	960	11.387718	80	32	2026-03-31 06:08:36.045511
5256	151	2026-03-02	5	5	0	t	1200	16.245543	100	40	2026-03-31 06:08:36.047484
5257	151	2026-03-03	5	4	1	t	960	12.850401	80	32	2026-03-31 06:08:36.050044
5258	151	2026-03-04	5	4	1	t	960	11.860299	80	32	2026-03-31 06:08:36.051876
5259	151	2026-03-05	5	4	1	t	960	14.627069	80	32	2026-03-31 06:08:36.053738
5260	151	2026-03-06	5	4	1	t	960	12.794631	80	32	2026-03-31 06:08:36.056158
5261	151	2026-03-07	5	5	0	t	1200	15.052442	100	40	2026-03-31 06:08:36.058992
5262	151	2026-03-08	5	4	1	t	960	12.05749	80	32	2026-03-31 06:08:36.061394
5263	151	2026-03-09	5	4	1	t	960	11.958908	80	32	2026-03-31 06:08:36.063847
5264	151	2026-03-10	5	5	0	t	1200	15.473198	100	40	2026-03-31 06:08:36.066104
5265	151	2026-03-11	5	4	1	t	960	12.542876	80	32	2026-03-31 06:08:36.06813
5266	151	2026-03-12	5	4	1	t	960	13.566372	80	32	2026-03-31 06:08:36.070207
5267	151	2026-03-13	5	4	1	t	960	14.756908	80	32	2026-03-31 06:08:36.072712
5268	151	2026-03-14	5	4	1	t	960	12.696073	80	32	2026-03-31 06:08:36.075
5269	151	2026-03-15	5	4	1	t	960	12.333149	80	32	2026-03-31 06:08:36.077233
5270	151	2026-03-16	5	5	0	t	1200	14.436289	100	40	2026-03-31 06:08:36.079335
5271	151	2026-03-17	5	4	1	t	960	11.202383	80	32	2026-03-31 06:08:36.081805
5272	151	2026-03-18	5	5	0	t	1200	15.860946	100	40	2026-03-31 06:08:36.083836
5273	151	2026-03-19	5	4	1	t	960	12.0932865	80	32	2026-03-31 06:08:36.085948
5274	151	2026-03-20	5	4	1	t	960	12.37208	80	32	2026-03-31 06:08:36.088522
5275	151	2026-03-21	5	4	1	t	960	11.19966	80	32	2026-03-31 06:08:36.09099
5276	151	2026-03-22	5	5	0	t	1200	16.169981	100	40	2026-03-31 06:08:36.09333
5277	151	2026-03-23	5	4	1	t	960	12.174366	80	32	2026-03-31 06:08:36.095485
5278	151	2026-03-24	5	4	1	t	960	13.471709	80	32	2026-03-31 06:08:36.09755
5279	151	2026-03-25	5	4	1	t	960	11.092077	80	32	2026-03-31 06:08:36.100033
5280	151	2026-03-26	5	5	0	t	1200	17.54679	100	40	2026-03-31 06:08:36.102355
5281	151	2026-03-27	5	4	1	t	960	11.068737	80	32	2026-03-31 06:08:36.104442
5282	151	2026-03-28	5	5	0	t	1200	15.060843	100	40	2026-03-31 06:08:36.106636
5283	151	2026-03-29	5	4	1	t	960	14.768439	80	32	2026-03-31 06:08:36.109117
5284	151	2026-03-30	5	5	0	t	1200	14.740407	100	40	2026-03-31 06:08:36.111431
5285	151	2026-03-31	5	4	1	t	960	14.326312	80	32	2026-03-31 06:08:36.114202
5286	152	2026-02-25	5	1	4	f	200	6.0515094	17	7	2026-03-31 06:08:36.175591
5287	152	2026-02-26	5	1	4	f	200	4.522194	17	7	2026-03-31 06:08:36.178018
5288	152	2026-02-27	5	1	4	f	200	2.9683533	17	7	2026-03-31 06:08:36.18053
5289	152	2026-02-28	5	1	4	f	200	2.85865	17	7	2026-03-31 06:08:36.182604
5290	152	2026-03-01	5	1	4	f	200	5.8622646	17	7	2026-03-31 06:08:36.184469
5291	152	2026-03-02	5	1	4	f	200	6.029533	17	7	2026-03-31 06:08:36.186742
5292	152	2026-03-03	5	1	4	f	200	4.0785894	17	7	2026-03-31 06:08:36.188777
5293	152	2026-03-04	5	1	4	f	200	3.242355	17	7	2026-03-31 06:08:36.191264
5294	152	2026-03-05	5	1	4	f	200	2.9122694	17	7	2026-03-31 06:08:36.193283
5295	152	2026-03-06	5	1	4	f	200	3.8542051	17	7	2026-03-31 06:08:36.195874
5296	152	2026-03-07	5	1	4	f	200	3.7631044	17	7	2026-03-31 06:08:36.198071
5297	152	2026-03-08	5	1	4	f	200	4.129143	17	7	2026-03-31 06:08:36.200398
5298	152	2026-03-09	5	1	4	f	200	3.7985632	17	7	2026-03-31 06:08:36.202772
5299	152	2026-03-10	5	1	4	f	200	3.3266428	17	7	2026-03-31 06:08:36.205168
5300	152	2026-03-11	5	1	4	f	200	6.0818596	17	7	2026-03-31 06:08:36.207677
5301	152	2026-03-12	5	1	4	f	200	5.8760166	17	7	2026-03-31 06:08:36.209752
5302	152	2026-03-13	5	1	4	f	200	3.8923538	17	7	2026-03-31 06:08:36.212111
5303	152	2026-03-14	5	1	4	f	200	4.956407	17	7	2026-03-31 06:08:36.214296
5304	152	2026-03-15	5	1	4	f	200	6.0432944	17	7	2026-03-31 06:08:36.216424
5305	152	2026-03-16	5	1	4	f	200	3.8788428	17	7	2026-03-31 06:08:36.218548
5306	152	2026-03-17	5	1	4	f	200	6.2051272	17	7	2026-03-31 06:08:36.221438
5307	152	2026-03-18	5	1	4	f	200	4.924659	17	7	2026-03-31 06:08:36.223703
5308	152	2026-03-19	5	1	4	f	200	5.125713	17	7	2026-03-31 06:08:36.22579
5309	152	2026-03-20	5	1	4	f	200	5.243279	17	7	2026-03-31 06:08:36.228459
5310	152	2026-03-21	5	1	4	t	200	5.700778	17	7	2026-03-31 06:08:36.231089
5311	152	2026-03-22	5	1	4	t	200	6.31416	17	7	2026-03-31 06:08:36.23376
5312	152	2026-03-23	5	1	4	t	200	3.6481068	17	7	2026-03-31 06:08:36.236167
5313	152	2026-03-24	5	1	4	t	200	4.575933	17	7	2026-03-31 06:08:36.238615
5314	152	2026-03-25	5	1	4	t	200	4.383929	17	7	2026-03-31 06:08:36.240859
5315	152	2026-03-26	5	1	4	t	200	5.110432	17	7	2026-03-31 06:08:36.243522
5316	152	2026-03-27	5	1	4	t	200	5.312601	17	7	2026-03-31 06:08:36.245621
5317	152	2026-03-28	5	1	4	t	200	4.4856415	17	7	2026-03-31 06:08:36.248142
5318	152	2026-03-29	5	1	4	t	200	3.8002398	17	7	2026-03-31 06:08:36.250392
5319	152	2026-03-30	5	1	4	t	200	5.92921	17	7	2026-03-31 06:08:36.253564
5320	152	2026-03-31	5	1	4	t	200	4.486222	17	7	2026-03-31 06:08:36.255761
5321	153	2026-02-25	5	4	1	f	1120	9.080963	96	36	2026-03-31 06:08:36.316122
5322	153	2026-02-26	5	4	1	f	1120	8.093431	96	36	2026-03-31 06:08:36.318207
5323	153	2026-02-27	5	4	1	f	1120	9.640948	96	36	2026-03-31 06:08:36.320784
5324	153	2026-02-28	5	4	1	f	1120	9.745171	96	36	2026-03-31 06:08:36.323266
5325	153	2026-03-01	5	3	2	f	840	6.766892	72	27	2026-03-31 06:08:36.325306
5326	153	2026-03-02	5	3	2	f	840	8.008908	72	27	2026-03-31 06:08:36.327334
5327	153	2026-03-03	5	3	2	f	840	8.872987	72	27	2026-03-31 06:08:36.32994
5328	153	2026-03-04	5	4	1	t	1120	11.643039	96	36	2026-03-31 06:08:36.331872
5329	153	2026-03-05	5	3	2	t	840	7.000992	72	27	2026-03-31 06:08:36.334128
5330	153	2026-03-06	5	3	2	t	840	7.315756	72	27	2026-03-31 06:08:36.336179
5331	153	2026-03-07	5	3	2	t	840	5.588385	72	27	2026-03-31 06:08:36.33824
5332	153	2026-03-08	5	3	2	t	840	8.332593	72	27	2026-03-31 06:08:36.340653
5333	153	2026-03-09	5	4	1	t	1120	8.086181	96	36	2026-03-31 06:08:36.342543
5334	153	2026-03-10	5	4	1	t	1120	9.581461	96	36	2026-03-31 06:08:36.344477
5335	153	2026-03-11	5	3	2	t	840	5.6899776	72	27	2026-03-31 06:08:36.346936
5336	153	2026-03-12	5	3	2	t	840	7.6612434	72	27	2026-03-31 06:08:36.348869
5337	153	2026-03-13	5	4	1	t	1120	11.716425	96	36	2026-03-31 06:08:36.350955
5338	153	2026-03-14	5	4	1	t	1120	9.054438	96	36	2026-03-31 06:08:36.353108
5339	153	2026-03-15	5	4	1	t	1120	9.240096	96	36	2026-03-31 06:08:36.356142
5340	153	2026-03-16	5	3	2	t	840	8.95006	72	27	2026-03-31 06:08:36.358002
5341	153	2026-03-17	5	3	2	t	840	7.3433037	72	27	2026-03-31 06:08:36.360053
5342	153	2026-03-18	5	4	1	t	1120	10.7793665	96	36	2026-03-31 06:08:36.361885
5343	153	2026-03-19	5	4	1	t	1120	8.361969	96	36	2026-03-31 06:08:36.364296
5344	153	2026-03-20	5	3	2	t	840	9.13684	72	27	2026-03-31 06:08:36.36622
5345	153	2026-03-21	5	4	1	t	1120	7.8717213	96	36	2026-03-31 06:08:36.368557
5346	153	2026-03-22	5	4	1	t	1120	11.231762	96	36	2026-03-31 06:08:36.37077
5347	153	2026-03-23	5	3	2	t	840	9.359328	72	27	2026-03-31 06:08:36.372851
5348	153	2026-03-24	5	4	1	t	1120	8.543962	96	36	2026-03-31 06:08:36.374757
5349	153	2026-03-25	5	4	1	t	1120	9.475812	96	36	2026-03-31 06:08:36.377366
5350	153	2026-03-26	5	3	2	t	840	5.949082	72	27	2026-03-31 06:08:36.379711
5351	153	2026-03-27	5	4	1	t	1120	8.574842	96	36	2026-03-31 06:08:36.382192
5352	153	2026-03-28	5	3	2	t	840	8.209475	72	27	2026-03-31 06:08:36.384448
5353	153	2026-03-29	5	3	2	t	840	6.4564686	72	27	2026-03-31 06:08:36.386453
5354	153	2026-03-30	5	4	1	t	1120	11.59579	96	36	2026-03-31 06:08:36.38892
5355	153	2026-03-31	5	3	2	t	840	9.46256	72	27	2026-03-31 06:08:36.391276
5356	154	2026-02-25	5	2	3	f	640	7.0367107	54	20	2026-03-31 06:08:36.673046
5357	154	2026-02-26	5	2	3	f	640	7.2475734	54	20	2026-03-31 06:08:36.675344
5358	154	2026-02-27	5	2	3	f	640	5.738817	54	20	2026-03-31 06:08:36.677672
5359	154	2026-02-28	5	2	3	f	640	7.882173	54	20	2026-03-31 06:08:36.680195
5360	154	2026-03-01	5	3	2	f	960	10.444511	81	30	2026-03-31 06:08:36.682154
5361	154	2026-03-02	5	3	2	f	960	10.551621	81	30	2026-03-31 06:08:36.684606
5362	154	2026-03-03	5	3	2	f	960	8.655365	81	30	2026-03-31 06:08:36.686773
5363	154	2026-03-04	5	2	3	f	640	5.753662	54	20	2026-03-31 06:08:36.689307
5364	154	2026-03-05	5	2	3	f	640	6.810436	54	20	2026-03-31 06:08:36.691731
5365	154	2026-03-06	5	2	3	f	640	8.072935	54	20	2026-03-31 06:08:36.69431
5366	154	2026-03-07	5	2	3	f	640	5.265614	54	20	2026-03-31 06:08:36.697346
5367	154	2026-03-08	5	2	3	f	640	7.1480665	54	20	2026-03-31 06:08:36.700141
5368	154	2026-03-09	5	3	2	f	960	9.2785225	81	30	2026-03-31 06:08:36.702303
5369	154	2026-03-10	5	2	3	f	640	4.8412147	54	20	2026-03-31 06:08:36.704795
5370	154	2026-03-11	5	2	3	f	640	8.5458145	54	20	2026-03-31 06:08:36.707013
5371	154	2026-03-12	5	2	3	f	640	5.619891	54	20	2026-03-31 06:08:36.709876
5372	154	2026-03-13	5	3	2	t	960	11.52796	81	30	2026-03-31 06:08:36.712703
5373	154	2026-03-14	5	2	3	t	640	7.8537254	54	20	2026-03-31 06:08:36.715367
5374	154	2026-03-15	5	2	3	t	640	7.056912	54	20	2026-03-31 06:08:36.717948
5375	154	2026-03-16	5	2	3	t	640	8.051522	54	20	2026-03-31 06:08:36.720453
5376	154	2026-03-17	5	2	3	t	640	6.2833495	54	20	2026-03-31 06:08:36.722837
5377	154	2026-03-18	5	2	3	t	640	6.6173177	54	20	2026-03-31 06:08:36.725456
5378	154	2026-03-19	5	2	3	t	640	6.185401	54	20	2026-03-31 06:08:36.727998
5379	154	2026-03-20	5	2	3	t	640	7.01481	54	20	2026-03-31 06:08:36.731286
5380	154	2026-03-21	5	2	3	t	640	6.5421305	54	20	2026-03-31 06:08:36.733355
5381	154	2026-03-22	5	3	2	t	960	11.610955	81	30	2026-03-31 06:08:36.735454
5382	154	2026-03-23	5	2	3	t	640	8.479189	54	20	2026-03-31 06:08:36.737575
5383	154	2026-03-24	5	2	3	t	640	7.8335066	54	20	2026-03-31 06:08:36.739703
5384	154	2026-03-25	5	2	3	t	640	7.0382004	54	20	2026-03-31 06:08:36.741523
5385	154	2026-03-26	5	3	2	t	960	8.512919	81	30	2026-03-31 06:08:36.744095
5386	154	2026-03-27	5	3	2	t	960	8.79041	81	30	2026-03-31 06:08:36.745884
5387	154	2026-03-28	5	2	3	t	640	8.464738	54	20	2026-03-31 06:08:36.748235
5388	154	2026-03-29	5	2	3	t	640	8.345469	54	20	2026-03-31 06:08:36.750262
5389	154	2026-03-30	5	2	3	t	640	7.135925	54	20	2026-03-31 06:08:36.75229
5390	154	2026-03-31	5	2	3	t	640	6.9982367	54	20	2026-03-31 06:08:36.755191
5391	155	2026-02-25	5	5	0	t	1200	14.591499	100	40	2026-03-31 06:08:36.814446
5392	155	2026-02-26	5	5	0	t	1200	15.879645	100	40	2026-03-31 06:08:36.816693
5393	155	2026-02-27	5	5	0	t	1200	16.631334	100	40	2026-03-31 06:08:36.819723
5394	155	2026-02-28	5	4	1	t	960	12.140235	80	32	2026-03-31 06:08:36.821725
5395	155	2026-03-01	5	5	0	t	1200	15.354077	100	40	2026-03-31 06:08:36.824231
5396	155	2026-03-02	5	5	0	t	1200	15.25968	100	40	2026-03-31 06:08:36.826232
5397	155	2026-03-03	5	5	0	t	1200	14.065954	100	40	2026-03-31 06:08:36.82825
5398	155	2026-03-04	5	4	1	t	960	14.458915	80	32	2026-03-31 06:08:36.830133
5399	155	2026-03-05	5	4	1	t	960	13.343679	80	32	2026-03-31 06:08:36.832148
5400	155	2026-03-06	5	4	1	t	960	11.838276	80	32	2026-03-31 06:08:36.834081
5401	155	2026-03-07	5	4	1	t	960	13.238477	80	32	2026-03-31 06:08:36.836534
5402	155	2026-03-08	5	5	0	t	1200	17.173504	100	40	2026-03-31 06:08:36.838769
5403	155	2026-03-09	5	5	0	t	1200	14.556271	100	40	2026-03-31 06:08:36.840736
5404	155	2026-03-10	5	5	0	t	1200	16.01382	100	40	2026-03-31 06:08:36.842716
5405	155	2026-03-11	5	5	0	t	1200	14.60975	100	40	2026-03-31 06:08:36.845311
5406	155	2026-03-12	5	5	0	t	1200	17.112959	100	40	2026-03-31 06:08:36.847226
5407	155	2026-03-13	5	5	0	t	1200	16.528051	100	40	2026-03-31 06:08:36.849298
5408	155	2026-03-14	5	4	1	t	960	11.891284	80	32	2026-03-31 06:08:36.85215
5409	155	2026-03-15	5	4	1	t	960	13.332607	80	32	2026-03-31 06:08:36.854295
5410	155	2026-03-16	5	5	0	t	1200	15.697274	100	40	2026-03-31 06:08:36.856613
5411	155	2026-03-17	5	4	1	t	960	13.176799	80	32	2026-03-31 06:08:36.859139
5412	155	2026-03-18	5	4	1	t	960	14.1931095	80	32	2026-03-31 06:08:36.861081
5413	155	2026-03-19	5	5	0	t	1200	14.543235	100	40	2026-03-31 06:08:36.863286
5414	155	2026-03-20	5	4	1	t	960	14.207835	80	32	2026-03-31 06:08:36.865736
5415	155	2026-03-21	5	5	0	t	1200	15.342231	100	40	2026-03-31 06:08:36.86822
5416	155	2026-03-22	5	5	0	t	1200	15.054563	100	40	2026-03-31 06:08:36.870453
5417	155	2026-03-23	5	4	1	t	960	12.001266	80	32	2026-03-31 06:08:36.872737
5418	155	2026-03-24	5	5	0	t	1200	16.34875	100	40	2026-03-31 06:08:36.874472
5419	155	2026-03-25	5	5	0	t	1200	16.186312	100	40	2026-03-31 06:08:36.876838
5420	155	2026-03-26	5	5	0	t	1200	14.853778	100	40	2026-03-31 06:08:36.879264
5421	155	2026-03-27	5	5	0	t	1200	14.9363165	100	40	2026-03-31 06:08:36.881844
5422	155	2026-03-28	5	4	1	t	960	11.016084	80	32	2026-03-31 06:08:36.883798
5423	155	2026-03-29	5	4	1	t	960	11.516088	80	32	2026-03-31 06:08:36.886244
5424	155	2026-03-30	5	4	1	t	960	11.334484	80	32	2026-03-31 06:08:36.88932
5425	155	2026-03-31	5	4	1	t	960	14.518197	80	32	2026-03-31 06:08:36.891833
5426	156	2026-02-25	5	1	4	f	200	6.4502473	17	7	2026-03-31 06:08:36.952266
5427	156	2026-02-26	5	1	4	f	200	4.7767673	17	7	2026-03-31 06:08:36.954745
5428	156	2026-02-27	5	1	4	f	200	3.1272418	17	7	2026-03-31 06:08:36.957166
5429	156	2026-02-28	5	2	3	f	400	9.806064	34	14	2026-03-31 06:08:36.959465
5430	156	2026-03-01	5	2	3	f	400	9.902397	34	14	2026-03-31 06:08:36.962243
5431	156	2026-03-02	5	1	4	f	200	4.8392224	17	7	2026-03-31 06:08:36.964361
5432	156	2026-03-03	5	1	4	f	200	4.544036	17	7	2026-03-31 06:08:36.9669
5433	156	2026-03-04	5	2	3	f	400	9.588039	34	14	2026-03-31 06:08:36.969615
5434	156	2026-03-05	5	2	3	f	400	10.282995	34	14	2026-03-31 06:08:36.972389
5435	156	2026-03-06	5	1	4	f	200	3.2481494	17	7	2026-03-31 06:08:36.974748
5436	156	2026-03-07	5	1	4	f	200	4.7789865	17	7	2026-03-31 06:08:36.977712
5437	156	2026-03-08	5	2	3	f	400	7.4557	34	14	2026-03-31 06:08:36.979997
5438	156	2026-03-09	5	2	3	f	400	6.8983765	34	14	2026-03-31 06:08:36.982911
5439	156	2026-03-10	5	2	3	f	400	6.937498	34	14	2026-03-31 06:08:36.985264
5440	156	2026-03-11	5	1	4	f	200	5.5731173	17	7	2026-03-31 06:08:36.987624
5441	156	2026-03-12	5	1	4	f	200	4.0635414	17	7	2026-03-31 06:08:36.990069
5442	156	2026-03-13	5	1	4	f	200	3.8023424	17	7	2026-03-31 06:08:36.991966
5443	156	2026-03-14	5	2	3	f	400	7.255322	34	14	2026-03-31 06:08:36.99455
5444	156	2026-03-15	5	1	4	f	200	5.1679826	17	7	2026-03-31 06:08:36.997059
5445	156	2026-03-16	5	1	4	f	200	5.7324905	17	7	2026-03-31 06:08:36.999372
5446	156	2026-03-17	5	1	4	f	200	3.2801507	17	7	2026-03-31 06:08:37.001742
5447	156	2026-03-18	5	1	4	t	200	4.3998194	17	7	2026-03-31 06:08:37.004898
5448	156	2026-03-19	5	2	3	t	400	7.247529	34	14	2026-03-31 06:08:37.007182
5449	156	2026-03-20	5	1	4	t	200	4.506578	17	7	2026-03-31 06:08:37.009768
5450	156	2026-03-21	5	2	3	t	400	9.988989	34	14	2026-03-31 06:08:37.011998
5451	156	2026-03-22	5	2	3	t	400	6.7728853	34	14	2026-03-31 06:08:37.01436
5452	156	2026-03-23	5	1	4	t	200	5.4825306	17	7	2026-03-31 06:08:37.017203
5453	156	2026-03-24	5	2	3	t	400	6.470942	34	14	2026-03-31 06:08:37.019561
5454	156	2026-03-25	5	1	4	t	200	2.7363887	17	7	2026-03-31 06:08:37.021979
5455	156	2026-03-26	5	2	3	t	400	8.9047165	34	14	2026-03-31 06:08:37.024035
5456	156	2026-03-27	5	1	4	t	200	2.5685496	17	7	2026-03-31 06:08:37.02619
5457	156	2026-03-28	5	2	3	t	400	8.517443	34	14	2026-03-31 06:08:37.028457
5458	156	2026-03-29	5	2	3	t	400	7.6129026	34	14	2026-03-31 06:08:37.030749
5459	156	2026-03-30	5	2	3	t	400	7.744615	34	14	2026-03-31 06:08:37.032721
5460	156	2026-03-31	5	1	4	t	200	4.385037	17	7	2026-03-31 06:08:37.034876
\.


--
-- Data for Name: meal_entries; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.meal_entries (id, kid_id, date, meal_type, food_name, quantity, unit, calories, carbs, fat, protein, created_at) FROM stdin;
\.


--
-- Data for Name: meal_logs; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.meal_logs (id, kid_id, date, meal_type, is_completed, calories, carbs, fat, protein, notes, image_url, created_at) FROM stdin;
521	105	2026-03-31	breakfast	f	0	0	0	0	\N	\N	2026-03-31 04:08:29.349
522	105	2026-03-31	morning_snack	f	0	0	0	0	\N	\N	2026-03-31 00:08:29.352
523	105	2026-03-30	lunch	t	240	4	20	8	\N	\N	2026-03-30 20:08:29.354
524	105	2026-03-30	afternoon_snack	t	240	4	20	8	\N	\N	2026-03-30 16:08:29.356
525	105	2026-03-30	dinner	t	240	4	20	8	\N	\N	2026-03-30 12:08:29.358
526	106	2026-03-31	breakfast	f	0	0	0	0	\N	\N	2026-03-31 04:08:29.488
527	106	2026-03-31	morning_snack	f	0	0	0	0	\N	\N	2026-03-31 00:08:29.49
528	106	2026-03-30	lunch	f	0	0	0	0	\N	\N	2026-03-30 20:08:29.493
529	106	2026-03-30	afternoon_snack	f	0	0	0	0	\N	\N	2026-03-30 16:08:29.495
530	106	2026-03-30	dinner	f	0	0	0	0	\N	\N	2026-03-30 12:08:29.497
531	107	2026-03-31	breakfast	t	280	3	24	9	\N	\N	2026-03-31 04:08:29.629
532	107	2026-03-31	morning_snack	t	280	3	24	9	\N	\N	2026-03-31 00:08:29.632
533	107	2026-03-30	lunch	t	280	3	24	9	\N	\N	2026-03-30 20:08:29.634
534	107	2026-03-30	afternoon_snack	t	280	3	24	9	\N	\N	2026-03-30 16:08:29.636
535	107	2026-03-30	dinner	t	280	3	24	9	\N	\N	2026-03-30 12:08:29.639
536	108	2026-03-31	breakfast	t	320	4	27	10	\N	\N	2026-03-31 04:08:29.873
537	108	2026-03-31	morning_snack	f	0	0	0	0	\N	\N	2026-03-31 00:08:29.875
538	108	2026-03-30	lunch	t	320	4	27	10	\N	\N	2026-03-30 20:08:29.878
539	108	2026-03-30	afternoon_snack	f	0	0	0	0	\N	\N	2026-03-30 16:08:29.88
540	108	2026-03-30	dinner	t	320	4	27	10	\N	\N	2026-03-30 12:08:29.883
541	109	2026-03-31	breakfast	f	0	0	0	0	\N	\N	2026-03-31 04:08:30.024
542	109	2026-03-31	morning_snack	f	0	0	0	0	\N	\N	2026-03-31 00:08:30.027
543	109	2026-03-30	lunch	f	0	0	0	0	\N	\N	2026-03-30 20:08:30.029
544	109	2026-03-30	afternoon_snack	f	0	0	0	0	\N	\N	2026-03-30 16:08:30.031
545	109	2026-03-30	dinner	f	0	0	0	0	\N	\N	2026-03-30 12:08:30.034
546	110	2026-03-31	breakfast	f	0	0	0	0	\N	\N	2026-03-31 04:08:30.16
547	110	2026-03-31	morning_snack	f	0	0	0	0	\N	\N	2026-03-31 00:08:30.163
548	110	2026-03-30	lunch	t	200	5	17	7	\N	\N	2026-03-30 20:08:30.165
549	110	2026-03-30	afternoon_snack	t	200	5	17	7	\N	\N	2026-03-30 16:08:30.167
550	110	2026-03-30	dinner	t	200	5	17	7	\N	\N	2026-03-30 12:08:30.169
551	111	2026-03-31	breakfast	t	240	4	20	8	\N	\N	2026-03-31 04:08:30.297
552	111	2026-03-31	morning_snack	t	240	4	20	8	\N	\N	2026-03-31 00:08:30.299
553	111	2026-03-30	lunch	t	240	4	20	8	\N	\N	2026-03-30 20:08:30.301
554	111	2026-03-30	afternoon_snack	f	0	0	0	0	\N	\N	2026-03-30 16:08:30.303
555	111	2026-03-30	dinner	t	240	4	20	8	\N	\N	2026-03-30 12:08:30.305
556	112	2026-03-31	breakfast	f	0	0	0	0	\N	\N	2026-03-31 04:08:30.434
557	112	2026-03-31	morning_snack	f	0	0	0	0	\N	\N	2026-03-31 00:08:30.436
558	112	2026-03-30	lunch	t	280	3	24	9	\N	\N	2026-03-30 20:08:30.438
559	112	2026-03-30	afternoon_snack	f	0	0	0	0	\N	\N	2026-03-30 16:08:30.441
560	112	2026-03-30	dinner	t	280	3	24	9	\N	\N	2026-03-30 12:08:30.443
561	113	2026-03-31	breakfast	t	200	5	17	7	\N	\N	2026-03-31 04:08:30.566
562	113	2026-03-31	morning_snack	t	200	5	17	7	\N	\N	2026-03-31 00:08:30.569
563	113	2026-03-30	lunch	t	200	5	17	7	\N	\N	2026-03-30 20:08:30.571
564	113	2026-03-30	afternoon_snack	t	200	5	17	7	\N	\N	2026-03-30 16:08:30.574
565	113	2026-03-30	dinner	t	200	5	17	7	\N	\N	2026-03-30 12:08:30.576
566	114	2026-03-31	breakfast	f	0	0	0	0	\N	\N	2026-03-31 04:08:30.704
567	114	2026-03-31	morning_snack	t	320	4	27	10	\N	\N	2026-03-31 00:08:30.706
568	114	2026-03-30	lunch	f	0	0	0	0	\N	\N	2026-03-30 20:08:30.709
569	114	2026-03-30	afternoon_snack	t	320	4	27	10	\N	\N	2026-03-30 16:08:30.711
570	114	2026-03-30	dinner	t	320	4	27	10	\N	\N	2026-03-30 12:08:30.713
571	115	2026-03-31	breakfast	f	0	0	0	0	\N	\N	2026-03-31 04:08:30.847
572	115	2026-03-31	morning_snack	t	200	5	17	7	\N	\N	2026-03-31 00:08:30.849
573	115	2026-03-30	lunch	f	0	0	0	0	\N	\N	2026-03-30 20:08:30.852
574	115	2026-03-30	afternoon_snack	t	200	5	17	7	\N	\N	2026-03-30 16:08:30.854
575	115	2026-03-30	dinner	t	200	5	17	7	\N	\N	2026-03-30 12:08:30.856
576	116	2026-03-31	breakfast	t	240	4	20	8	\N	\N	2026-03-31 04:08:30.984
577	116	2026-03-31	morning_snack	t	240	4	20	8	\N	\N	2026-03-31 00:08:30.987
578	116	2026-03-30	lunch	f	0	0	0	0	\N	\N	2026-03-30 20:08:30.989
579	116	2026-03-30	afternoon_snack	f	0	0	0	0	\N	\N	2026-03-30 16:08:30.991
580	116	2026-03-30	dinner	f	0	0	0	0	\N	\N	2026-03-30 12:08:30.994
581	117	2026-03-31	breakfast	t	280	3	24	9	\N	\N	2026-03-31 04:08:31.199
582	117	2026-03-31	morning_snack	f	0	0	0	0	\N	\N	2026-03-31 00:08:31.202
583	117	2026-03-30	lunch	t	280	3	24	9	\N	\N	2026-03-30 20:08:31.205
584	117	2026-03-30	afternoon_snack	t	280	3	24	9	\N	\N	2026-03-30 16:08:31.207
585	117	2026-03-30	dinner	t	280	3	24	9	\N	\N	2026-03-30 12:08:31.209
586	118	2026-03-31	breakfast	f	0	0	0	0	\N	\N	2026-03-31 04:08:31.34
587	118	2026-03-31	morning_snack	f	0	0	0	0	\N	\N	2026-03-31 00:08:31.343
588	118	2026-03-30	lunch	f	0	0	0	0	\N	\N	2026-03-30 20:08:31.345
589	118	2026-03-30	afternoon_snack	f	0	0	0	0	\N	\N	2026-03-30 16:08:31.348
590	118	2026-03-30	dinner	f	0	0	0	0	\N	\N	2026-03-30 12:08:31.35
591	119	2026-03-31	breakfast	t	240	4	20	8	\N	\N	2026-03-31 04:08:31.481
592	119	2026-03-31	morning_snack	t	240	4	20	8	\N	\N	2026-03-31 00:08:31.483
593	119	2026-03-30	lunch	t	240	4	20	8	\N	\N	2026-03-30 20:08:31.486
594	119	2026-03-30	afternoon_snack	t	240	4	20	8	\N	\N	2026-03-30 16:08:31.488
595	119	2026-03-30	dinner	t	240	4	20	8	\N	\N	2026-03-30 12:08:31.49
596	120	2026-03-31	breakfast	t	200	5	17	7	\N	\N	2026-03-31 04:08:31.638
597	120	2026-03-31	morning_snack	f	0	0	0	0	\N	\N	2026-03-31 00:08:31.64
598	120	2026-03-30	lunch	t	200	5	17	7	\N	\N	2026-03-30 20:08:31.643
599	120	2026-03-30	afternoon_snack	t	200	5	17	7	\N	\N	2026-03-30 16:08:31.645
600	120	2026-03-30	dinner	t	200	5	17	7	\N	\N	2026-03-30 12:08:31.647
601	121	2026-03-31	breakfast	t	280	3	24	9	\N	\N	2026-03-31 04:08:31.778
602	121	2026-03-31	morning_snack	t	280	3	24	9	\N	\N	2026-03-31 00:08:31.78
603	121	2026-03-30	lunch	t	280	3	24	9	\N	\N	2026-03-30 20:08:31.783
604	121	2026-03-30	afternoon_snack	t	280	3	24	9	\N	\N	2026-03-30 16:08:31.785
605	121	2026-03-30	dinner	t	280	3	24	9	\N	\N	2026-03-30 12:08:31.788
606	122	2026-03-31	breakfast	f	0	0	0	0	\N	\N	2026-03-31 04:08:31.915
607	122	2026-03-31	morning_snack	t	320	4	27	10	\N	\N	2026-03-31 00:08:31.918
608	122	2026-03-30	lunch	t	320	4	27	10	\N	\N	2026-03-30 20:08:31.92
609	122	2026-03-30	afternoon_snack	f	0	0	0	0	\N	\N	2026-03-30 16:08:31.923
610	122	2026-03-30	dinner	t	320	4	27	10	\N	\N	2026-03-30 12:08:31.924
611	123	2026-03-31	breakfast	t	240	4	20	8	\N	\N	2026-03-31 04:08:32.056
612	123	2026-03-31	morning_snack	t	240	4	20	8	\N	\N	2026-03-31 00:08:32.058
613	123	2026-03-30	lunch	t	240	4	20	8	\N	\N	2026-03-30 20:08:32.06
614	123	2026-03-30	afternoon_snack	t	240	4	20	8	\N	\N	2026-03-30 16:08:32.063
615	123	2026-03-30	dinner	t	240	4	20	8	\N	\N	2026-03-30 12:08:32.065
616	124	2026-03-31	breakfast	f	0	0	0	0	\N	\N	2026-03-31 04:08:32.196
617	124	2026-03-31	morning_snack	t	200	5	17	7	\N	\N	2026-03-31 00:08:32.198
618	124	2026-03-30	lunch	t	200	5	17	7	\N	\N	2026-03-30 20:08:32.2
619	124	2026-03-30	afternoon_snack	f	0	0	0	0	\N	\N	2026-03-30 16:08:32.202
620	124	2026-03-30	dinner	f	0	0	0	0	\N	\N	2026-03-30 12:08:32.205
621	125	2026-03-31	breakfast	f	0	0	0	0	\N	\N	2026-03-31 04:08:32.339
622	125	2026-03-31	morning_snack	f	0	0	0	0	\N	\N	2026-03-31 00:08:32.342
623	125	2026-03-30	lunch	f	0	0	0	0	\N	\N	2026-03-30 20:08:32.344
624	125	2026-03-30	afternoon_snack	f	0	0	0	0	\N	\N	2026-03-30 16:08:32.348
625	125	2026-03-30	dinner	f	0	0	0	0	\N	\N	2026-03-30 12:08:32.35
626	126	2026-03-31	breakfast	t	320	4	27	10	\N	\N	2026-03-31 04:08:32.483
627	126	2026-03-31	morning_snack	t	320	4	27	10	\N	\N	2026-03-31 00:08:32.486
628	126	2026-03-30	lunch	t	320	4	27	10	\N	\N	2026-03-30 20:08:32.488
629	126	2026-03-30	afternoon_snack	t	320	4	27	10	\N	\N	2026-03-30 16:08:32.491
630	126	2026-03-30	dinner	t	320	4	27	10	\N	\N	2026-03-30 12:08:32.494
631	127	2026-03-31	breakfast	f	0	0	0	0	\N	\N	2026-03-31 04:08:32.633
632	127	2026-03-31	morning_snack	f	0	0	0	0	\N	\N	2026-03-31 00:08:32.635
633	127	2026-03-30	lunch	t	200	5	17	7	\N	\N	2026-03-30 20:08:32.638
634	127	2026-03-30	afternoon_snack	t	200	5	17	7	\N	\N	2026-03-30 16:08:32.641
635	127	2026-03-30	dinner	f	0	0	0	0	\N	\N	2026-03-30 12:08:32.644
636	128	2026-03-31	breakfast	t	240	4	20	8	\N	\N	2026-03-31 04:08:32.786
637	128	2026-03-31	morning_snack	t	240	4	20	8	\N	\N	2026-03-31 00:08:32.788
638	128	2026-03-30	lunch	t	240	4	20	8	\N	\N	2026-03-30 20:08:32.791
639	128	2026-03-30	afternoon_snack	t	240	4	20	8	\N	\N	2026-03-30 16:08:32.793
640	128	2026-03-30	dinner	t	240	4	20	8	\N	\N	2026-03-30 12:08:32.795
641	129	2026-03-31	breakfast	t	280	3	24	9	\N	\N	2026-03-31 04:08:32.936
642	129	2026-03-31	morning_snack	t	280	3	24	9	\N	\N	2026-03-31 00:08:32.939
643	129	2026-03-30	lunch	f	0	0	0	0	\N	\N	2026-03-30 20:08:32.941
644	129	2026-03-30	afternoon_snack	t	280	3	24	9	\N	\N	2026-03-30 16:08:32.943
645	129	2026-03-30	dinner	t	280	3	24	9	\N	\N	2026-03-30 12:08:32.945
646	130	2026-03-31	breakfast	f	0	0	0	0	\N	\N	2026-03-31 04:08:33.077
647	130	2026-03-31	morning_snack	f	0	0	0	0	\N	\N	2026-03-31 00:08:33.079
648	130	2026-03-30	lunch	t	200	5	17	7	\N	\N	2026-03-30 20:08:33.081
649	130	2026-03-30	afternoon_snack	t	200	5	17	7	\N	\N	2026-03-30 16:08:33.084
650	130	2026-03-30	dinner	f	0	0	0	0	\N	\N	2026-03-30 12:08:33.086
651	131	2026-03-31	breakfast	t	240	4	20	8	\N	\N	2026-03-31 04:08:33.216
652	131	2026-03-31	morning_snack	f	0	0	0	0	\N	\N	2026-03-31 00:08:33.218
653	131	2026-03-30	lunch	t	240	4	20	8	\N	\N	2026-03-30 20:08:33.22
654	131	2026-03-30	afternoon_snack	t	240	4	20	8	\N	\N	2026-03-30 16:08:33.222
655	131	2026-03-30	dinner	t	240	4	20	8	\N	\N	2026-03-30 12:08:33.225
656	132	2026-03-31	breakfast	t	320	4	27	10	\N	\N	2026-03-31 04:08:33.355
657	132	2026-03-31	morning_snack	t	320	4	27	10	\N	\N	2026-03-31 00:08:33.357
658	132	2026-03-30	lunch	t	320	4	27	10	\N	\N	2026-03-30 20:08:33.359
659	132	2026-03-30	afternoon_snack	t	320	4	27	10	\N	\N	2026-03-30 16:08:33.362
660	132	2026-03-30	dinner	t	320	4	27	10	\N	\N	2026-03-30 12:08:33.365
661	133	2026-03-31	breakfast	f	0	0	0	0	\N	\N	2026-03-31 04:08:33.492
662	133	2026-03-31	morning_snack	t	200	5	17	7	\N	\N	2026-03-31 00:08:33.494
663	133	2026-03-30	lunch	t	200	5	17	7	\N	\N	2026-03-30 20:08:33.497
664	133	2026-03-30	afternoon_snack	f	0	0	0	0	\N	\N	2026-03-30 16:08:33.499
665	133	2026-03-30	dinner	t	200	5	17	7	\N	\N	2026-03-30 12:08:33.501
666	134	2026-03-31	breakfast	t	280	3	24	9	\N	\N	2026-03-31 04:08:33.634
667	134	2026-03-31	morning_snack	f	0	0	0	0	\N	\N	2026-03-31 00:08:33.637
668	134	2026-03-30	lunch	f	0	0	0	0	\N	\N	2026-03-30 20:08:33.639
669	134	2026-03-30	afternoon_snack	f	0	0	0	0	\N	\N	2026-03-30 16:08:33.642
670	134	2026-03-30	dinner	f	0	0	0	0	\N	\N	2026-03-30 12:08:33.644
671	135	2026-03-31	breakfast	f	0	0	0	0	\N	\N	2026-03-31 04:08:33.774
672	135	2026-03-31	morning_snack	f	0	0	0	0	\N	\N	2026-03-31 00:08:33.776
673	135	2026-03-30	lunch	f	0	0	0	0	\N	\N	2026-03-30 20:08:33.778
674	135	2026-03-30	afternoon_snack	f	0	0	0	0	\N	\N	2026-03-30 16:08:33.78
675	135	2026-03-30	dinner	f	0	0	0	0	\N	\N	2026-03-30 12:08:33.783
676	136	2026-03-31	breakfast	t	200	5	17	7	\N	\N	2026-03-31 04:08:33.915
677	136	2026-03-31	morning_snack	t	200	5	17	7	\N	\N	2026-03-31 00:08:33.917
678	136	2026-03-30	lunch	f	0	0	0	0	\N	\N	2026-03-30 20:08:33.919
679	136	2026-03-30	afternoon_snack	f	0	0	0	0	\N	\N	2026-03-30 16:08:33.922
680	136	2026-03-30	dinner	f	0	0	0	0	\N	\N	2026-03-30 12:08:33.924
681	137	2026-03-31	breakfast	t	240	4	20	8	\N	\N	2026-03-31 04:08:34.055
682	137	2026-03-31	morning_snack	t	240	4	20	8	\N	\N	2026-03-31 00:08:34.058
683	137	2026-03-30	lunch	t	240	4	20	8	\N	\N	2026-03-30 20:08:34.061
684	137	2026-03-30	afternoon_snack	t	240	4	20	8	\N	\N	2026-03-30 16:08:34.064
685	137	2026-03-30	dinner	t	240	4	20	8	\N	\N	2026-03-30 12:08:34.067
686	138	2026-03-31	breakfast	f	0	0	0	0	\N	\N	2026-03-31 04:08:34.21
687	138	2026-03-31	morning_snack	f	0	0	0	0	\N	\N	2026-03-31 00:08:34.213
688	138	2026-03-30	lunch	f	0	0	0	0	\N	\N	2026-03-30 20:08:34.216
689	138	2026-03-30	afternoon_snack	f	0	0	0	0	\N	\N	2026-03-30 16:08:34.218
690	138	2026-03-30	dinner	f	0	0	0	0	\N	\N	2026-03-30 12:08:34.221
691	139	2026-03-31	breakfast	t	240	4	20	8	\N	\N	2026-03-31 04:08:34.36
692	139	2026-03-31	morning_snack	t	240	4	20	8	\N	\N	2026-03-31 00:08:34.363
693	139	2026-03-30	lunch	t	240	4	20	8	\N	\N	2026-03-30 20:08:34.366
694	139	2026-03-30	afternoon_snack	t	240	4	20	8	\N	\N	2026-03-30 16:08:34.369
695	139	2026-03-30	dinner	f	0	0	0	0	\N	\N	2026-03-30 12:08:34.372
696	140	2026-03-31	breakfast	t	280	3	24	9	\N	\N	2026-03-31 04:08:34.506
697	140	2026-03-31	morning_snack	t	280	3	24	9	\N	\N	2026-03-31 00:08:34.509
698	140	2026-03-30	lunch	f	0	0	0	0	\N	\N	2026-03-30 20:08:34.511
699	140	2026-03-30	afternoon_snack	t	280	3	24	9	\N	\N	2026-03-30 16:08:34.514
700	140	2026-03-30	dinner	f	0	0	0	0	\N	\N	2026-03-30 12:08:34.516
701	141	2026-03-31	breakfast	t	200	5	17	7	\N	\N	2026-03-31 04:08:34.647
702	141	2026-03-31	morning_snack	t	200	5	17	7	\N	\N	2026-03-31 00:08:34.65
703	141	2026-03-30	lunch	t	200	5	17	7	\N	\N	2026-03-30 20:08:34.653
704	141	2026-03-30	afternoon_snack	t	200	5	17	7	\N	\N	2026-03-30 16:08:34.655
705	141	2026-03-30	dinner	t	200	5	17	7	\N	\N	2026-03-30 12:08:34.658
706	142	2026-03-31	breakfast	t	320	4	27	10	\N	\N	2026-03-31 04:08:34.791
707	142	2026-03-31	morning_snack	t	320	4	27	10	\N	\N	2026-03-31 00:08:34.793
708	142	2026-03-30	lunch	t	320	4	27	10	\N	\N	2026-03-30 20:08:34.795
709	142	2026-03-30	afternoon_snack	t	320	4	27	10	\N	\N	2026-03-30 16:08:34.797
710	142	2026-03-30	dinner	t	320	4	27	10	\N	\N	2026-03-30 12:08:34.799
711	143	2026-03-31	breakfast	f	0	0	0	0	\N	\N	2026-03-31 04:08:34.933
712	143	2026-03-31	morning_snack	f	0	0	0	0	\N	\N	2026-03-31 00:08:34.935
713	143	2026-03-30	lunch	f	0	0	0	0	\N	\N	2026-03-30 20:08:34.938
714	143	2026-03-30	afternoon_snack	f	0	0	0	0	\N	\N	2026-03-30 16:08:34.941
715	143	2026-03-30	dinner	f	0	0	0	0	\N	\N	2026-03-30 12:08:34.943
716	144	2026-03-31	breakfast	t	240	4	20	8	\N	\N	2026-03-31 04:08:35.099
717	144	2026-03-31	morning_snack	t	240	4	20	8	\N	\N	2026-03-31 00:08:35.101
718	144	2026-03-30	lunch	f	0	0	0	0	\N	\N	2026-03-30 20:08:35.105
719	144	2026-03-30	afternoon_snack	t	240	4	20	8	\N	\N	2026-03-30 16:08:35.107
720	144	2026-03-30	dinner	t	240	4	20	8	\N	\N	2026-03-30 12:08:35.111
721	145	2026-03-31	breakfast	f	0	0	0	0	\N	\N	2026-03-31 04:08:35.262
722	145	2026-03-31	morning_snack	f	0	0	0	0	\N	\N	2026-03-31 00:08:35.264
723	145	2026-03-30	lunch	f	0	0	0	0	\N	\N	2026-03-30 20:08:35.267
724	145	2026-03-30	afternoon_snack	t	280	3	24	9	\N	\N	2026-03-30 16:08:35.269
725	145	2026-03-30	dinner	f	0	0	0	0	\N	\N	2026-03-30 12:08:35.271
726	146	2026-03-31	breakfast	t	320	4	27	10	\N	\N	2026-03-31 04:08:35.402
727	146	2026-03-31	morning_snack	t	320	4	27	10	\N	\N	2026-03-31 00:08:35.405
728	146	2026-03-30	lunch	t	320	4	27	10	\N	\N	2026-03-30 20:08:35.408
729	146	2026-03-30	afternoon_snack	t	320	4	27	10	\N	\N	2026-03-30 16:08:35.41
730	146	2026-03-30	dinner	t	320	4	27	10	\N	\N	2026-03-30 12:08:35.412
731	147	2026-03-31	breakfast	f	0	0	0	0	\N	\N	2026-03-31 04:08:35.542
732	147	2026-03-31	morning_snack	f	0	0	0	0	\N	\N	2026-03-31 00:08:35.544
733	147	2026-03-30	lunch	f	0	0	0	0	\N	\N	2026-03-30 20:08:35.546
734	147	2026-03-30	afternoon_snack	f	0	0	0	0	\N	\N	2026-03-30 16:08:35.548
735	147	2026-03-30	dinner	f	0	0	0	0	\N	\N	2026-03-30 12:08:35.551
736	148	2026-03-31	breakfast	t	200	5	17	7	\N	\N	2026-03-31 04:08:35.685
737	148	2026-03-31	morning_snack	t	200	5	17	7	\N	\N	2026-03-31 00:08:35.688
738	148	2026-03-30	lunch	t	200	5	17	7	\N	\N	2026-03-30 20:08:35.69
739	148	2026-03-30	afternoon_snack	t	200	5	17	7	\N	\N	2026-03-30 16:08:35.692
740	148	2026-03-30	dinner	t	200	5	17	7	\N	\N	2026-03-30 12:08:35.694
741	149	2026-03-31	breakfast	f	0	0	0	0	\N	\N	2026-03-31 04:08:35.837
742	149	2026-03-31	morning_snack	f	0	0	0	0	\N	\N	2026-03-31 00:08:35.839
743	149	2026-03-30	lunch	f	0	0	0	0	\N	\N	2026-03-30 20:08:35.841
744	149	2026-03-30	afternoon_snack	f	0	0	0	0	\N	\N	2026-03-30 16:08:35.844
745	149	2026-03-30	dinner	f	0	0	0	0	\N	\N	2026-03-30 12:08:35.846
746	150	2026-03-31	breakfast	t	280	3	24	9	\N	\N	2026-03-31 04:08:35.977
747	150	2026-03-31	morning_snack	t	280	3	24	9	\N	\N	2026-03-31 00:08:35.979
748	150	2026-03-30	lunch	t	280	3	24	9	\N	\N	2026-03-30 20:08:35.981
749	150	2026-03-30	afternoon_snack	t	280	3	24	9	\N	\N	2026-03-30 16:08:35.983
750	150	2026-03-30	dinner	t	280	3	24	9	\N	\N	2026-03-30 12:08:35.985
751	151	2026-03-31	breakfast	t	240	4	20	8	\N	\N	2026-03-31 04:08:36.116
752	151	2026-03-31	morning_snack	t	240	4	20	8	\N	\N	2026-03-31 00:08:36.118
753	151	2026-03-30	lunch	t	240	4	20	8	\N	\N	2026-03-30 20:08:36.121
754	151	2026-03-30	afternoon_snack	t	240	4	20	8	\N	\N	2026-03-30 16:08:36.123
755	151	2026-03-30	dinner	t	240	4	20	8	\N	\N	2026-03-30 12:08:36.125
756	152	2026-03-31	breakfast	f	0	0	0	0	\N	\N	2026-03-31 04:08:36.257
757	152	2026-03-31	morning_snack	f	0	0	0	0	\N	\N	2026-03-31 00:08:36.259
758	152	2026-03-30	lunch	f	0	0	0	0	\N	\N	2026-03-30 20:08:36.261
759	152	2026-03-30	afternoon_snack	f	0	0	0	0	\N	\N	2026-03-30 16:08:36.263
760	152	2026-03-30	dinner	f	0	0	0	0	\N	\N	2026-03-30 12:08:36.266
761	153	2026-03-31	breakfast	t	280	3	24	9	\N	\N	2026-03-31 04:08:36.393
762	153	2026-03-31	morning_snack	t	280	3	24	9	\N	\N	2026-03-31 00:08:36.396
763	153	2026-03-30	lunch	t	280	3	24	9	\N	\N	2026-03-30 20:08:36.398
764	153	2026-03-30	afternoon_snack	t	280	3	24	9	\N	\N	2026-03-30 16:08:36.4
765	153	2026-03-30	dinner	t	280	3	24	9	\N	\N	2026-03-30 12:08:36.402
766	154	2026-03-31	breakfast	t	320	4	27	10	\N	\N	2026-03-31 04:08:36.757
767	154	2026-03-31	morning_snack	f	0	0	0	0	\N	\N	2026-03-31 00:08:36.759
768	154	2026-03-30	lunch	t	320	4	27	10	\N	\N	2026-03-30 20:08:36.761
769	154	2026-03-30	afternoon_snack	f	0	0	0	0	\N	\N	2026-03-30 16:08:36.763
770	154	2026-03-30	dinner	f	0	0	0	0	\N	\N	2026-03-30 12:08:36.765
771	155	2026-03-31	breakfast	t	240	4	20	8	\N	\N	2026-03-31 04:08:36.894
772	155	2026-03-31	morning_snack	t	240	4	20	8	\N	\N	2026-03-31 00:08:36.896
773	155	2026-03-30	lunch	t	240	4	20	8	\N	\N	2026-03-30 20:08:36.898
774	155	2026-03-30	afternoon_snack	t	240	4	20	8	\N	\N	2026-03-30 16:08:36.9
775	155	2026-03-30	dinner	t	240	4	20	8	\N	\N	2026-03-30 12:08:36.902
776	156	2026-03-31	breakfast	f	0	0	0	0	\N	\N	2026-03-31 04:08:37.037
777	156	2026-03-31	morning_snack	f	0	0	0	0	\N	\N	2026-03-31 00:08:37.039
778	156	2026-03-30	lunch	f	0	0	0	0	\N	\N	2026-03-30 20:08:37.042
779	156	2026-03-30	afternoon_snack	f	0	0	0	0	\N	\N	2026-03-30 16:08:37.044
780	156	2026-03-30	dinner	f	0	0	0	0	\N	\N	2026-03-30 12:08:37.047
\.


--
-- Data for Name: meal_plan_assignment_history; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.meal_plan_assignment_history (id, kid_id, plan_id, plan_name, doctor_id, doctor_name, action, assigned_at, created_at) FROM stdin;
1	119	48	Weekend Treat Keto Plan	1	Dr. Sarah Johnson	assigned	2026-04-02 04:36:56.58801	2026-04-02 04:36:56.58801
\.


--
-- Data for Name: meal_plan_items; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.meal_plan_items (id, plan_id, meal_type, food_id, food_name, portion_grams, calories, carbs, fat, protein, notes, created_at) FROM stdin;
\.


--
-- Data for Name: meal_plans; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.meal_plans (id, kid_id, name, description, is_active, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: meal_type_recipes; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.meal_type_recipes (meal_type_id, recipe_id) FROM stdin;
1	103
2	104
3	104
1	105
2	105
2	106
3	106
2	107
3	107
1	108
2	109
3	109
2	110
3	110
2	111
3	111
1	112
2	112
2	113
3	113
2	114
3	114
2	115
1	116
2	116
2	117
3	117
2	118
3	118
2	119
3	119
2	120
3	120
2	121
3	121
1	122
2	123
3	123
1	124
2	125
2	126
1	127
2	128
3	128
2	129
3	129
3	130
2	131
3	131
1	132
1	133
2	133
1	134
1	135
1	136
1	137
2	137
1	138
2	138
1	139
2	139
2	140
3	140
2	141
3	141
2	142
3	142
2	143
3	143
2	144
3	144
2	145
3	145
3	146
3	147
3	148
2	149
2	150
2	151
3	152
3	153
\.


--
-- Data for Name: meal_types; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.meal_types (id, name, created_at) FROM stdin;
1	Breakfast	2026-03-31 05:29:49.257963
2	Lunch	2026-03-31 05:29:49.26037
3	Dinner	2026-03-31 05:29:49.262785
\.


--
-- Data for Name: medical_settings; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.medical_settings (id, kid_id, phase, keto_ratio, daily_calories, daily_carbs, daily_fat, daily_protein, show_all_foods, show_all_recipes, updated_at) FROM stdin;
157	157	1	3	1200	20	100	40	t	t	2026-04-02 04:09:10.442097
105	105	2	3	1200	20	100	40	t	t	2026-03-31 06:08:29.214205
106	106	1	2	1000	25	85	35	t	t	2026-03-31 06:08:29.361282
107	107	3	4	1400	15	120	45	t	t	2026-03-31 06:08:29.500174
108	108	4	4	1600	20	135	50	t	t	2026-03-31 06:08:29.642329
109	109	2	3	1200	20	100	40	t	t	2026-03-31 06:08:29.885894
110	110	1	2	1000	25	85	35	t	t	2026-03-31 06:08:30.036663
111	111	2	3	1200	20	100	40	t	t	2026-03-31 06:08:30.17148
112	112	3	4	1400	15	120	45	t	t	2026-03-31 06:08:30.308236
113	113	1	2	1000	25	85	35	t	t	2026-03-31 06:08:30.445749
114	114	4	4	1600	20	135	50	t	t	2026-03-31 06:08:30.579069
115	115	1	2	1000	25	85	35	t	t	2026-03-31 06:08:30.7158
116	116	2	3	1200	20	100	40	t	t	2026-03-31 06:08:30.859359
117	117	3	4	1400	15	120	45	t	t	2026-03-31 06:08:30.996904
118	118	4	4	1600	20	135	50	t	t	2026-03-31 06:08:31.2122
119	119	2	3	1200	20	100	40	t	t	2026-03-31 06:08:31.353092
120	120	1	2	1000	25	85	35	t	t	2026-03-31 06:08:31.493684
121	121	3	4	1400	15	120	45	t	t	2026-03-31 06:08:31.650459
122	122	4	4	1600	20	135	50	t	t	2026-03-31 06:08:31.791424
123	123	2	3	1200	20	100	40	t	t	2026-03-31 06:08:31.927176
124	124	1	2	1000	25	85	35	t	t	2026-03-31 06:08:32.067067
125	125	3	4	1400	15	120	45	t	t	2026-03-31 06:08:32.207369
126	126	4	4	1600	20	135	50	t	t	2026-03-31 06:08:32.353111
127	127	1	2	1000	25	85	35	t	t	2026-03-31 06:08:32.497646
128	128	2	3	1200	20	100	40	t	t	2026-03-31 06:08:32.646701
129	129	3	4	1400	15	120	45	t	t	2026-03-31 06:08:32.798576
130	130	1	2	1000	25	85	35	t	t	2026-03-31 06:08:32.948101
131	131	2	3	1200	20	100	40	t	t	2026-03-31 06:08:33.089264
132	132	4	4	1600	20	135	50	t	t	2026-03-31 06:08:33.22749
133	133	1	2	1000	25	85	35	t	t	2026-03-31 06:08:33.367191
134	134	3	4	1400	15	120	45	t	t	2026-03-31 06:08:33.503986
135	135	1	2	1000	25	85	35	t	t	2026-03-31 06:08:33.64737
136	136	1	2	1000	25	85	35	t	t	2026-03-31 06:08:33.786218
137	137	2	3	1200	20	100	40	t	t	2026-03-31 06:08:33.926908
138	138	4	4	1600	20	135	50	t	t	2026-03-31 06:08:34.069441
139	139	2	3	1200	20	100	40	t	t	2026-03-31 06:08:34.2238
140	140	3	4	1400	15	120	45	t	t	2026-03-31 06:08:34.374927
141	141	1	2	1000	25	85	35	t	t	2026-03-31 06:08:34.51866
142	142	4	4	1600	20	135	50	t	t	2026-03-31 06:08:34.661106
143	143	1	2	1000	25	85	35	t	t	2026-03-31 06:08:34.801724
144	144	2	3	1200	20	100	40	t	t	2026-03-31 06:08:34.946148
145	145	3	4	1400	15	120	45	t	t	2026-03-31 06:08:35.118475
146	146	4	4	1600	20	135	50	t	t	2026-03-31 06:08:35.273715
147	147	2	3	1200	20	100	40	t	t	2026-03-31 06:08:35.414684
148	148	1	2	1000	25	85	35	t	t	2026-03-31 06:08:35.554982
149	149	1	2	1000	25	85	35	t	t	2026-03-31 06:08:35.69851
150	150	3	4	1400	15	120	45	t	t	2026-03-31 06:08:35.849485
151	151	2	3	1200	20	100	40	t	t	2026-03-31 06:08:35.98731
152	152	1	2	1000	25	85	35	t	t	2026-03-31 06:08:36.128465
153	153	3	4	1400	15	120	45	t	t	2026-03-31 06:08:36.268482
154	154	4	4	1600	20	135	50	t	t	2026-03-31 06:08:36.405253
155	155	2	3	1200	20	100	40	t	t	2026-03-31 06:08:36.768358
156	156	1	2	1000	25	85	35	t	t	2026-03-31 06:08:36.905333
\.


--
-- Data for Name: notes; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.notes (id, kid_id, doctor_id, doctor_name, content, created_at) FROM stdin;
105	105	1	Dr. Sarah Johnson	Patient maintaining excellent keto compliance. Parents report good tolerance with no adverse GI effects. Continue current 3:1 protocol.	2026-03-31 06:08:37.049018
106	106	1	Dr. Sarah Johnson	Weight slightly below target range. Recommended calorie increase of 10%. Parents given revised meal plan guidance. Follow-up in 2 weeks.	2026-03-31 06:08:37.051175
107	107	1	Dr. Sarah Johnson	Seizure frequency reduced by 60% since initiating ketogenic therapy. Blood ketones consistently 3.0–4.2 mmol/L. Excellent therapeutic response.	2026-03-31 06:08:37.053116
108	108	1	Dr. Sarah Johnson	Parents experiencing meal prep difficulties. Referred to specialist dietitian for hands-on support session. Will reassess compliance at next visit.	2026-03-31 06:08:37.05551
109	109	1	Dr. Sarah Johnson	Blood ketone levels consistently above 2.0 mmol/L. Therapy is working well. Patient is alert and growing appropriately for age.	2026-03-31 06:08:37.057412
110	110	1	Dr. Sarah Johnson	New patient — completing phase 1 induction week. Family educated on carb counting and meal weighing. Tolerating diet well.	2026-03-31 06:08:37.059799
111	111	1	Dr. Sarah Johnson	Patient in phase 2 with stable seizure control. Slight weight gain this month, adjusting fat ratios accordingly.	2026-03-31 06:08:37.062098
112	112	1	Dr. Sarah Johnson	Increased ketone target to 3.5 mmol/L for better seizure control. Monitoring blood glucose for hypoglycemia risk.	2026-03-31 06:08:37.064391
113	113	1	Dr. Sarah Johnson	Phase 1 patient showing improvement. First ketone reading of 1.8 mmol/L achieved. Parents very motivated and compliant.	2026-03-31 06:08:37.066233
114	114	1	Dr. Sarah Johnson	Phase 4 maintenance — patient doing well, transitioning slowly off strict keto. Carb allowance increased to 20g/day.	2026-03-31 06:08:37.068149
115	115	1	Dr. Sarah Johnson	Youngest patient in the program. Parents diligent with measurements. Ketones at 1.2 mmol/L — target range for phase 1.	2026-03-31 06:08:37.070505
116	116	1	Dr. Sarah Johnson	Mid-protocol review: Good seizure reduction (approx 45%). Meal completion at 55%, needs improvement. Reviewed barriers with family.	2026-03-31 06:08:37.073093
117	117	1	Dr. Sarah Johnson	Seizure-free for 3 weeks following intensification to 4:1 ratio. Ketones averaging 3.8 mmol/L. Exceptional response.	2026-03-31 06:08:37.075231
118	118	1	Dr. Sarah Johnson	Longstanding keto patient — 4 years on diet. Considering weaning protocol. Will discuss with neurology team.	2026-03-31 06:08:37.077411
119	119	1	Dr. Sarah Johnson	Stable phase 2 patient. Parents report improved energy and concentration at school. Meal completion rate improving steadily.	2026-03-31 06:08:37.079561
120	120	1	Dr. Sarah Johnson	Phase 1 induction progressing well. Urinary ketones detected day 3. Family adapting to meal weighing routine. No adverse symptoms reported.	2026-03-31 06:08:37.081927
121	121	1	Dr. Sarah Johnson	Patient on 4:1 ratio showing strong seizure control. Mild constipation reported — increased fiber via approved vegetables. Hydration counseling given.	2026-03-31 06:08:37.084217
122	122	1	Dr. Sarah Johnson	Phase 4 patient, 2 years on protocol. Growth velocity normal. Bone density scan scheduled. Continue current maintenance plan.	2026-03-31 06:08:37.086592
123	123	1	Dr. Sarah Johnson	Phase 2 transition smooth. Ketone levels stable at 2.4 mmol/L. Parents confident with carb calculations. Next review in 4 weeks.	2026-03-31 06:08:37.088533
124	124	1	Dr. Sarah Johnson	Newest patient — just started phase 1. Initial baseline labs completed. Family orientation session done. Meal plan distributed.	2026-03-31 06:08:37.090522
125	125	1	Dr. Sarah Johnson	Patient showing excellent 4:1 compliance. Seizure diary shows 80% reduction from baseline. Some food refusal — discussed strategies with parents.	2026-03-31 06:08:37.092432
126	126	1	Dr. Sarah Johnson	Long-term phase 4 patient. Considering transition to modified Atkins. EEG review pending. Diet well tolerated for 3+ years.	2026-03-31 06:08:37.094878
127	127	1	Dr. Sarah Johnson	Phase 1 patient, week 2. Ketones rising to 1.5 mmol/L. Mild lethargy reported — advised on electrolyte supplementation.	2026-03-31 06:08:37.096788
128	128	1	Dr. Sarah Johnson	Phase 2 patient with good adherence. Parents requesting more recipe variety. Shared additional keto recipe resources.	2026-03-31 06:08:37.098722
129	129	1	Dr. Sarah Johnson	High-ratio protocol (4:1) for refractory epilepsy. Blood glucose stable. Weight gain adequate. Continue current approach.	2026-03-31 06:08:37.100946
130	130	1	Dr. Sarah Johnson	Phase 1 patient adapting slowly. Meal completion at 48%. Parents struggling with portion accuracy. Scheduled dietitian follow-up.	2026-03-31 06:08:37.103541
131	131	1	Dr. Sarah Johnson	Phase 2 patient — steady improvement over 3 months. Ketones averaging 2.2 mmol/L. School nurse informed about diet requirements.	2026-03-31 06:08:37.105943
132	132	1	Dr. Sarah Johnson	Phase 4 maintenance — excellent long-term compliance. Annual labs within normal limits. Discuss potential weaning timeline at next visit.	2026-03-31 06:08:37.107965
133	133	1	Dr. Sarah Johnson	Youngest phase 1 patient. Very small portions. Parents extremely careful with measurements. Good ketone response at 1.3 mmol/L.	2026-03-31 06:08:37.110353
134	134	1	Dr. Sarah Johnson	Phase 3 intensification initiated. Increasing fat ratio from 3:1 to 4:1. Blood monitoring frequency increased to twice weekly.	2026-03-31 06:08:37.112409
135	135	1	Dr. Sarah Johnson	Very young patient at 6 months — diet introduced cautiously. Parents trained intensively on formula preparation. Daily monitoring in place.	2026-03-31 06:08:37.114538
136	136	1	Dr. Sarah Johnson	Phase 1 patient, week 3. Slow start to compliance. Parents overwhelmed with meal weighing. Support group referral made.	2026-03-31 06:08:37.116843
137	137	1	Dr. Sarah Johnson	Phase 2 patient with consistent 88% compliance. Excellent seizure control since diet initiation. Family very engaged with protocol.	2026-03-31 06:08:37.119331
138	138	1	Dr. Sarah Johnson	Diet poorly tolerated — GI symptoms reported. Considering 2:1 ratio as starting point. Labs ordered to assess electrolytes.	2026-03-31 06:08:37.1217
139	139	1	Dr. Sarah Johnson	Phase 2 — steady progress. Patient alert and active at school. Blood ketones 2.1 mmol/L. Continue current plan.	2026-03-31 06:08:37.123574
140	140	1	Dr. Sarah Johnson	Compliance dipping at 40%. Family recently relocated, disrupting routine. Connecting with local dietitian for ongoing support.	2026-03-31 06:08:37.125986
141	141	1	Dr. Sarah Johnson	Phase 3 patient achieving 95% compliance. Seizures reduced from daily to twice weekly. Excellent prognosis for continued improvement.	2026-03-31 06:08:37.128391
142	142	1	Dr. Sarah Johnson	Mid-protocol review for phase 2 patient. Meal completion at 58%. Parents report difficulty with school lunches. Created portable meal guide.	2026-03-31 06:08:37.130808
143	143	1	Dr. Sarah Johnson	Patient flagged High Risk — completion below 60%. Emergency review scheduled. Parents contacted via phone. Dietitian follow-up booked.	2026-03-31 06:08:37.133668
144	144	1	Dr. Sarah Johnson	Phase 2 patient with 84% compliance. Growing steadily. Blood glucose within target. Continue 3:1 protocol.	2026-03-31 06:08:37.135744
145	145	1	Dr. Sarah Johnson	Phase 3 — initial results encouraging. First two weeks on strict 4:1. Ketones reaching 3.0 mmol/L. Mild irritability noted, likely transitional.	2026-03-31 06:08:37.138142
146	146	1	Dr. Sarah Johnson	Phase 1 patient, day 18. Low-carb adaptation progressing. Urinary ketones positive since day 5. Parents diligent with journaling.	2026-03-31 06:08:37.140675
147	147	1	Dr. Sarah Johnson	Phase 4 maintenance. Patient on diet for 2.5 years. Transition plan drafted in collaboration with neurology. Gradual carb increase planned.	2026-03-31 06:08:37.143211
148	148	1	Dr. Sarah Johnson	Compliance suddenly dropped to 38%. Parents report child refusing some keto foods. Flavour variety session held with dietitian.	2026-03-31 06:08:37.145676
149	149	1	Dr. Sarah Johnson	Phase 2 — consistent 63% completion rate. Aiming for 75% by next review. Family attending monthly group clinic sessions.	2026-03-31 06:08:37.148075
150	150	1	Dr. Sarah Johnson	Phase 3 with strong 87% compliance. Bloodwork excellent — no deficiencies detected. Parents highly confident with meal preparation.	2026-03-31 06:08:37.149977
151	151	1	Dr. Sarah Johnson	High-risk alert — 20% completion. Family crisis situation identified. Social worker involved. Diet temporarily simplified to aid compliance.	2026-03-31 06:08:37.15232
152	152	1	Dr. Sarah Johnson	Phase 2 patient performing well overall. Ketones stable. Parents keen to progress to phase 3. Discussed timeline and criteria with family.	2026-03-31 06:08:37.154646
153	153	1	Dr. Sarah Johnson	Phase 1 patient at 44% completion. Recently diagnosed; family still in adjustment phase. Weekly check-in calls arranged with clinic nurse.	2026-03-31 06:08:37.156507
154	154	1	Dr. Sarah Johnson	Phase 3 patient exceeding targets at 91% compliance. Seizure diary shows 75% reduction. Discussed potential weaning in 6 months.	2026-03-31 06:08:37.15889
155	155	1	Dr. Sarah Johnson	High-risk patient. Completion at 29%. Multiple missed days identified in meal log review. Intensive support package initiated with family.	2026-03-31 06:08:37.161172
156	156	1	Dr. Sarah Johnson	Infant patient (6 months). Diet introduced under close supervision. Formula-based ketogenic plan active. Ketones 0.8 mmol/L at day 10.	2026-03-31 06:08:37.164161
\.


--
-- Data for Name: parent_tokens; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.parent_tokens (id, kid_id, token, status, expires_at, used_at, created_at, revoked_at) FROM stdin;
1	129	LTJ-7370	active	2026-07-01 04:12:43.862	\N	2026-04-02 04:12:29.461553	\N
2	109	RRW-2784	active	2026-07-01 04:13:08.684	\N	2026-04-02 04:13:00.653912	\N
\.


--
-- Data for Name: recipe_ingredients; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.recipe_ingredients (id, recipe_id, food_name, portion_grams, unit, carbs, fat, protein, calories) FROM stdin;
347	103	Bacon	60	g	0.4	25	22	325
348	103	Whole Eggs	100	g	0.6	10	13	155
349	103	Cheddar Cheese	20	g	0.3	6.6	5	81
350	104	Chicken Thigh	150	g	0	13.5	39	314
351	104	Spinach	80	g	1.1	0.3	2.3	18
352	104	Heavy Cream	40	g	1.4	14	0.8	136
353	104	Parmesan	15	g	0.5	4.4	5.7	65
354	105	MCT Oil	20	g	0	20	0	172
355	105	Coconut Oil	15	g	0	15	0	129
356	105	Almond Butter	20	g	1.4	10	4.2	123
357	106	Cauliflower	150	g	7.5	0.5	2.9	38
358	106	Cheddar Cheese	40	g	0.5	13.2	10	161
359	106	Cream Cheese	30	g	1.2	9.9	1.8	103
360	106	Butter	10	g	0	8.1	0.1	72
361	107	Salmon	140	g	0	18.2	35	291
362	107	Avocado	80	g	1.6	12	1.6	128
363	107	Olive Oil	10	g	0	10	0	88
364	108	Almond Flour	40	g	4	21.6	9.6	230
365	108	Cream Cheese	30	g	1.2	9.9	1.8	103
366	108	Whole Eggs	50	g	0.3	5	6.5	78
367	108	Butter	15	g	0	12.2	0.1	108
368	109	Ground Beef	150	g	0	30	39	431
369	109	Broccoli	100	g	4	0.4	2.6	34
370	109	Avocado Oil	10	g	0	10	0	88
371	110	Zucchini	200	g	6.2	0.6	2.4	34
372	110	Ground Beef	100	g	0	20	26	287
373	110	Mozzarella	40	g	0.9	8.8	8.8	112
374	111	Chicken Breast	150	g	0	5.4	46.5	248
375	111	Almond Flour	30	g	3	16.2	7.2	173
376	111	Butter	10	g	0	8.1	0.1	72
377	112	Pork Belly	120	g	0	63.6	10.8	622
378	112	Olive Oil	5	g	0	5	0	44
379	113	Whole Eggs	100	g	0.6	10	13	155
380	113	Spinach	50	g	0.7	0.2	1.5	12
381	113	Butter	10	g	0	8.1	0.1	72
382	114	Lamb Chops	180	g	0	43.2	45	567
383	114	Butter	20	g	0	16.2	0.2	143
384	114	Asparagus	80	g	3.1	0.1	1.8	16
385	115	Tuna	120	g	0	6	30	158
386	115	Lettuce	60	g	1.4	0.2	0.7	10
387	115	Avocado	50	g	1	7.5	1	80
388	115	Olive Oil	10	g	0	10	0	88
389	116	Almond Flour	30	g	3	16.2	7.2	173
390	116	Mozzarella	50	g	1.1	11	11	140
391	116	Bell Pepper	30	g	1.4	0.1	0.3	6
392	117	Mushrooms	150	g	5	0.5	4.7	33
393	117	Heavy Cream	60	g	2	21	1.3	204
394	117	Butter	15	g	0	12.2	0.1	108
395	118	Duck	160	g	0	44.8	30.4	539
396	118	Cabbage	80	g	4.6	0.1	1	20
397	118	Walnuts	20	g	1.4	13	3	131
398	119	Mackerel	140	g	0	18.2	26.6	287
399	119	Whole Eggs	50	g	0.3	5	6.5	78
400	119	Almond Flour	15	g	1.5	8.1	3.6	86
401	119	Coconut Oil	10	g	0	10	0	86
402	120	Beef Ribeye	200	g	0	74	54	900
403	120	Butter	20	g	0	16.2	0.2	143
404	121	Shrimp	150	g	1.4	2.1	36	159
405	121	Butter	20	g	0	16.2	0.2	143
406	121	Zucchini	100	g	3.1	0.3	1.2	17
407	122	Pecans	30	g	1.2	21.6	2.7	207
408	122	Chia Seeds	15	g	0.9	4.7	2.6	73
409	122	Coconut Oil	10	g	0	10	0	86
410	122	Coconut Meat	20	g	1.2	7	0.7	71
411	123	Cod	150	g	0	1.1	27	123
412	123	Butter	20	g	0	16.2	0.2	143
413	123	Green Beans	80	g	5.6	0.1	1.4	25
414	124	Whole Eggs	120	g	0.7	12	15.6	186
415	124	Mushrooms	40	g	1.3	0.1	1.2	9
416	124	Spinach	30	g	0.4	0.1	0.9	7
417	124	Cheddar Cheese	25	g	0.3	8.3	6.3	101
418	125	Turkey Breast	100	g	0	1	29	135
419	125	Avocado	60	g	1.2	9	1.2	96
420	125	Cream Cheese	25	g	1	8.3	1.5	86
421	126	Sardines	100	g	0	11	25	208
422	126	Lettuce	60	g	1.4	0.2	0.7	10
423	126	Olive Oil	15	g	0	15	0	133
424	126	Cucumber	50	g	1.8	0.1	0.4	8
425	127	Raspberries	40	g	2.2	0.3	0.5	21
426	127	Heavy Cream	60	g	2	21	1.3	204
427	127	MCT Oil	10	g	0	10	0	86
428	128	Flaxseed Meal	60	g	1.2	5.4	3	84
429	128	Whole Eggs	50	g	0.3	5	6.5	78
430	128	Butter	15	g	0	12.2	0.1	108
431	129	Eggplant	150	g	8.9	0.3	1.5	38
432	129	Mozzarella	50	g	1.1	11	11	140
433	129	Parmesan	20	g	0.6	5.8	7.6	86
434	129	Olive Oil	10	g	0	10	0	88
435	130	Chia Seeds	25	g	1.5	7.8	4.3	122
436	130	Heavy Cream	80	g	2.7	28	1.7	272
437	130	Blackberries	30	g	1.5	0.2	0.4	13
438	131	Chicken Breast	150	g	0	5.4	46.5	248
439	131	Pecans	30	g	1.2	21.6	2.7	207
440	131	Butter	10	g	0	8.1	0.1	72
441	131	Whole Eggs	50	g	0.3	5	6.5	78
442	132	Greek Yogurt	120	g	4.9	6	10.8	116
443	132	Hemp Seeds	15	g	0.5	7.4	4.8	83
444	132	Flaxseeds	10	g	0.3	4.2	1.8	53
445	132	MCT Oil	5	g	0	5	0	43
446	133	Almond Butter	30	g	2.1	15	6.3	184
447	133	Coconut Oil	15	g	0	15	0	129
448	133	MCT Oil	10	g	0	10	0	86
449	134	Avocado	80	g	1.6	12	1.6	128
450	134	Flaxseed Meal	40	g	0.8	3.6	2	56
451	134	Whole Eggs	50	g	0.3	5	6.5	78
452	134	Butter	10	g	0	8.1	0.1	72
453	135	Whole Eggs	150	g	0.9	15	19.5	233
454	135	Bacon	40	g	0.3	16.8	14.8	216
455	135	Cheddar Cheese	30	g	0.4	9.9	7.5	121
456	135	Butter	10	g	0	8.1	0.1	72
457	136	Whole Eggs	120	g	0.7	12	15.6	186
458	136	Spinach	60	g	0.8	0.2	1.7	14
459	136	Cream Cheese	25	g	1	8.3	1.5	86
460	136	Butter	10	g	0	8.1	0.1	72
461	137	Macadamia Nuts	35	g	1.8	26.6	2.8	251
462	137	Coconut Oil	5	g	0	5	0	43
463	138	Cucumber	80	g	2.9	0.1	0.6	12
464	138	Cream Cheese	40	g	1.6	13.2	2.4	137
465	139	Whole Eggs	120	g	0.7	12	15.6	186
466	139	Cream Cheese	20	g	0.8	6.6	1.2	68
467	139	Olive Oil	5	g	0	5	0	44
468	140	Cauliflower	200	g	10	0.6	3.8	50
469	140	Heavy Cream	50	g	1.7	17.5	1.1	170
470	140	Butter	15	g	0	12.2	0.1	108
471	140	Cream Cheese	20	g	0.8	6.6	1.2	68
472	141	Broccoli	150	g	6	0.6	3.9	51
473	141	Cheddar Cheese	60	g	0.8	19.8	15	242
474	141	Heavy Cream	60	g	2	21	1.3	204
475	141	Butter	10	g	0	8.1	0.1	72
476	142	Avocado	100	g	2	15	2	160
477	142	Spinach	80	g	1.1	0.3	2.3	18
478	142	Olive Oil	10	g	0	10	0	88
479	142	Heavy Cream	30	g	1	10.5	0.6	102
480	143	Asparagus	150	g	5.9	0.2	3.3	30
481	143	Egg Yolks	30	g	1.1	8.1	4.8	97
482	143	Butter	25	g	0	20.3	0.2	179
483	144	Green Beans	120	g	8.4	0.1	2.2	37
484	144	Butter	20	g	0	16.2	0.2	143
485	144	Parmesan	15	g	0.5	4.4	5.7	65
486	145	Cauliflower	180	g	9	0.5	3.4	45
487	145	Butter	20	g	0	16.2	0.2	143
488	145	Olive Oil	10	g	0	10	0	88
489	146	Almond Flour	60	g	6	32.4	14.4	346
490	146	Macadamia Nuts	20	g	1	15.2	1.6	144
491	146	Butter	20	g	0	16.2	0.2	143
492	146	Whole Eggs	25	g	0.2	2.5	3.3	39
493	147	Heavy Cream	80	g	2.7	28	1.7	272
494	147	Blueberries	20	g	2.4	0.1	0.1	11
495	147	Raspberries	20	g	1.1	0.1	0.2	10
496	147	Strawberries	20	g	1.5	0.1	0.1	6
497	148	Coconut Meat	50	g	3	17.5	1.7	177
498	148	Heavy Cream	60	g	2	21	1.3	204
499	148	MCT Oil	10	g	0	10	0	86
500	149	Bacon	50	g	0.4	21	18.5	271
501	149	Lettuce	80	g	1.9	0.2	1	14
502	149	Cream Cheese	25	g	1	8.3	1.5	86
503	149	Avocado	50	g	1	7.5	1	80
504	150	Shrimp	120	g	1.1	1.7	28.8	127
505	150	Avocado	80	g	1.6	12	1.6	128
506	150	Cucumber	60	g	2.2	0.1	0.4	9
507	150	Olive Oil	15	g	0	15	0	133
508	151	Chicken Breast	130	g	0	4.7	40.3	215
509	151	Lettuce	80	g	1.9	0.2	1	14
510	151	Parmesan	20	g	0.6	5.8	7.6	86
511	151	Olive Oil	15	g	0	15	0	133
512	152	Ground Beef	150	g	0	30	39	431
513	152	Lettuce	60	g	1.4	0.2	0.7	10
514	152	Cheddar Cheese	30	g	0.4	9.9	7.5	121
515	152	Avocado	60	g	1.2	9	1.2	96
516	153	Turkey Breast	150	g	0	1.5	43.5	203
517	153	Heavy Cream	60	g	2	21	1.3	204
518	153	Parmesan	20	g	0.6	5.8	7.6	86
519	153	Butter	10	g	0	8.1	0.1	72
\.


--
-- Data for Name: recipes; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.recipes (id, doctor_id, name, description, category, image_url, created_at, updated_at) FROM stdin;
103	1	Keto Bacon Egg Cups	Crispy bacon cups filled with baked eggs and cheese — a perfect high-fat breakfast.	Breakfast		2026-03-31 06:08:37.174407	2026-03-31 06:08:37.174407
104	1	Creamy Spinach Chicken	Pan-seared chicken thighs smothered in a creamy spinach and parmesan sauce.	Main Course		2026-03-31 06:08:37.183288	2026-03-31 06:08:37.183288
105	1	MCT Fat Bombs	No-bake chocolate fat bombs with MCT oil and coconut for rapid ketone production.	Snack		2026-03-31 06:08:37.194015	2026-03-31 06:08:37.194015
106	1	Cauliflower Mac and Cheese	Steamed cauliflower baked in a rich cheddar and cream cheese sauce — kid-friendly comfort food.	Main Course		2026-03-31 06:08:37.202183	2026-03-31 06:08:37.202183
107	1	Salmon Avocado Bowl	Flaked baked salmon served over sliced avocado with olive oil drizzle.	Main Course		2026-03-31 06:08:37.213399	2026-03-31 06:08:37.213399
108	1	Keto Pancakes	Fluffy almond flour pancakes with cream cheese batter — a breakfast treat.	Breakfast		2026-03-31 06:08:37.223574	2026-03-31 06:08:37.223574
109	1	Beef and Broccoli Stir-Fry	Tender ground beef with broccoli florets cooked in avocado oil.	Main Course		2026-03-31 06:08:37.234191	2026-03-31 06:08:37.234191
110	1	Cheesy Zucchini Boats	Hollowed zucchini stuffed with seasoned ground beef and melted mozzarella.	Main Course		2026-03-31 06:08:37.243117	2026-03-31 06:08:37.243117
111	1	Keto Chicken Nuggets	Crispy almond flour-coated chicken breast nuggets baked until golden — a kid favorite.	Main Course		2026-03-31 06:08:37.251703	2026-03-31 06:08:37.251703
112	1	Pork Belly Bites	Crispy roasted pork belly cubes seasoned with salt and herbs — ultra high-fat snack.	Snack		2026-03-31 06:08:37.261272	2026-03-31 06:08:37.261272
113	1	Egg Drop Soup	Simple and warming egg drop soup with spinach in a rich chicken broth base.	Soup		2026-03-31 06:08:37.26812	2026-03-31 06:08:37.26812
114	1	Lamb Chops with Herb Butter	Grilled lamb chops served with a rich herb-infused butter topping.	Main Course		2026-03-31 06:08:37.277542	2026-03-31 06:08:37.277542
115	1	Tuna Salad Lettuce Wraps	Creamy tuna salad served in crisp lettuce cups with avocado.	Lunch		2026-03-31 06:08:37.286645	2026-03-31 06:08:37.286645
116	1	Keto Pizza Bites	Mini pizza bites on an almond flour crust with mozzarella and peppers.	Snack		2026-03-31 06:08:37.298167	2026-03-31 06:08:37.298167
117	1	Creamy Mushroom Soup	Velvety mushroom soup made with heavy cream and butter — warming and keto-friendly.	Soup		2026-03-31 06:08:37.307954	2026-03-31 06:08:37.307954
118	1	Duck with Cabbage Slaw	Roasted duck leg with a tangy cabbage and walnut slaw.	Main Course		2026-03-31 06:08:37.316835	2026-03-31 06:08:37.316835
119	1	Mackerel Patties	Pan-fried mackerel patties bound with egg and almond flour — omega-3 packed.	Main Course		2026-03-31 06:08:37.326266	2026-03-31 06:08:37.326266
120	1	Ribeye Steak with Butter	Seared beef ribeye topped with melted herb butter — a classic high-fat keto dinner.	Main Course		2026-03-31 06:08:37.337314	2026-03-31 06:08:37.337314
121	1	Shrimp Scampi	Garlic butter shrimp served with sauteed zucchini noodles.	Main Course		2026-03-31 06:08:37.343754	2026-03-31 06:08:37.343754
122	1	Keto Granola	Crunchy homemade granola with pecans, chia seeds, and coconut flakes.	Breakfast		2026-03-31 06:08:37.352383	2026-03-31 06:08:37.352383
123	1	Cod with Lemon Butter	Baked cod fillets drizzled with lemon butter and served with green beans.	Main Course		2026-03-31 06:08:37.363187	2026-03-31 06:08:37.363187
124	1	Keto Egg Muffins	Baked egg muffins loaded with mushrooms, spinach, and cheddar cheese.	Breakfast		2026-03-31 06:08:37.37222	2026-03-31 06:08:37.37222
125	1	Turkey and Avocado Roll-Ups	Sliced turkey breast wrapped around avocado and cream cheese — a quick keto lunch.	Lunch		2026-03-31 06:08:37.383392	2026-03-31 06:08:37.383392
126	1	Sardine Salad	Protein-packed sardines served over a bed of mixed greens with olive oil dressing.	Lunch		2026-03-31 06:08:37.392038	2026-03-31 06:08:37.392038
127	1	Keto Berry Smoothie	Thick and creamy smoothie with raspberries, heavy cream, and MCT oil.	Breakfast		2026-03-31 06:08:37.403331	2026-03-31 06:08:37.403331
128	1	Flaxseed Keto Bread	Hearty low-carb bread made with flaxseed meal and eggs — perfect for toast.	Side		2026-03-31 06:08:37.411227	2026-03-31 06:08:37.411227
129	1	Eggplant Parmesan	Sliced eggplant baked with mozzarella and parmesan — a keto-friendly Italian classic.	Main Course		2026-03-31 06:08:37.419669	2026-03-31 06:08:37.419669
130	1	Keto Chia Pudding	Overnight chia seed pudding made with heavy cream and topped with blackberries.	Dessert		2026-03-31 06:08:37.429385	2026-03-31 06:08:37.429385
131	1	Pecan Crusted Chicken	Chicken breast coated in crushed pecans and baked until crispy.	Main Course		2026-03-31 06:08:37.4387	2026-03-31 06:08:37.4387
132	1	Greek Yogurt Keto Bowl	Full-fat Greek yogurt topped with hemp seeds, flaxseeds, and a drizzle of MCT oil.	Breakfast		2026-03-31 06:08:37.450285	2026-03-31 06:08:37.450285
133	1	Almond Butter Fat Bombs	Frozen almond butter and coconut oil bites — a quick morning snack loaded with healthy fats.	Snack		2026-03-31 06:08:37.460451	2026-03-31 06:08:37.460451
134	1	Keto Avocado Toast	Creamy mashed avocado on flaxseed keto bread with a soft-boiled egg on top.	Breakfast		2026-03-31 06:08:37.469483	2026-03-31 06:08:37.469483
135	1	Bacon and Cheddar Omelette	Fluffy omelette filled with crispy bacon bits and melted cheddar cheese.	Breakfast		2026-03-31 06:08:37.481377	2026-03-31 06:08:37.481377
136	1	Spinach and Feta Scramble	Creamy scrambled eggs with wilted spinach and crumbled feta-style cheese.	Breakfast		2026-03-31 06:08:37.492694	2026-03-31 06:08:37.492694
137	1	Macadamia Nut Clusters	Bite-sized clusters of macadamia nuts coated in coconut oil — zero prep, maximum fat.	Snack		2026-03-31 06:08:37.504709	2026-03-31 06:08:37.504709
138	1	Cucumber Cream Cheese Bites	Sliced cucumber rounds topped with herb cream cheese — a refreshing low-carb snack.	Snack		2026-03-31 06:08:37.510954	2026-03-31 06:08:37.510954
139	1	Deviled Eggs	Classic deviled eggs filled with yolk, mayo-style cream cheese, and a sprinkle of paprika.	Snack		2026-03-31 06:08:37.517177	2026-03-31 06:08:37.517177
140	1	Keto Cauliflower Soup	Velvety blended cauliflower soup enriched with butter and cream cheese.	Soup		2026-03-31 06:08:37.525978	2026-03-31 06:08:37.525978
141	1	Broccoli Cheddar Soup	Rich and comforting broccoli soup melted with cheddar and heavy cream.	Soup		2026-03-31 06:08:37.540705	2026-03-31 06:08:37.540705
142	1	Avocado Spinach Soup	Cold blended avocado and spinach soup with olive oil — a nutrient-dense keto lunch.	Soup		2026-03-31 06:08:37.553191	2026-03-31 06:08:37.553191
143	1	Asparagus with Hollandaise	Steamed asparagus spears with a rich egg yolk and butter hollandaise sauce.	Side		2026-03-31 06:08:37.568173	2026-03-31 06:08:37.568173
144	1	Garlic Butter Green Beans	Tender green beans sautéed in garlic-infused butter and parmesan.	Side		2026-03-31 06:08:37.582322	2026-03-31 06:08:37.582322
145	1	Cauliflower Rice Pilaf	Grated cauliflower sautéed in butter and seasoned as a keto rice substitute.	Side		2026-03-31 06:08:37.592121	2026-03-31 06:08:37.592121
146	1	Keto Almond Flour Cookies	Soft baked almond flour cookies with macadamia nuts — a keto-friendly dessert treat.	Dessert		2026-03-31 06:08:37.60052	2026-03-31 06:08:37.60052
147	1	Berry Cream Parfait	Layered whipped heavy cream with mixed berries — an elegant keto dessert.	Dessert		2026-03-31 06:08:37.611375	2026-03-31 06:08:37.611375
148	1	Coconut Cream Pudding	Thick coconut pudding made with coconut meat and heavy cream — dairy-optional keto dessert.	Dessert		2026-03-31 06:08:37.623988	2026-03-31 06:08:37.623988
149	1	BLT Lettuce Cups	Bacon, sliced tomato-free BLT served in crisp romaine lettuce with cream cheese spread.	Lunch		2026-03-31 06:08:37.633636	2026-03-31 06:08:37.633636
150	1	Shrimp and Avocado Salad	Juicy shrimp tossed with avocado and cucumber in an olive oil dressing.	Lunch		2026-03-31 06:08:37.644394	2026-03-31 06:08:37.644394
151	1	Chicken Caesar Salad (Keto)	Grilled chicken breast over romaine lettuce with parmesan and olive oil-based Caesar dressing.	Lunch		2026-03-31 06:08:37.656144	2026-03-31 06:08:37.656144
152	1	Keto Beef Tacos (Lettuce)	Seasoned ground beef served in crunchy lettuce shells with cheddar and avocado.	Dinner		2026-03-31 06:08:37.667137	2026-03-31 06:08:37.667137
153	1	Turkey Meatballs in Cream Sauce	Tender turkey meatballs simmered in a rich parmesan cream sauce.	Dinner		2026-03-31 06:08:37.678377	2026-03-31 06:08:37.678377
\.


--
-- Data for Name: weight_records; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.weight_records (id, kid_id, weight, date, note, created_at) FROM stdin;
1249	105	12.4	2026-01-13	\N	2026-03-31 06:08:29.217496
1250	105	12.6	2026-01-20	\N	2026-03-31 06:08:29.219815
1251	105	12.8	2026-01-27	\N	2026-03-31 06:08:29.223008
1252	105	12.9	2026-02-03	\N	2026-03-31 06:08:29.22549
1253	105	12.9	2026-02-10	\N	2026-03-31 06:08:29.228013
1254	105	13.2	2026-02-17	Mid-protocol review	2026-03-31 06:08:29.229672
1255	105	13.4	2026-02-24	\N	2026-03-31 06:08:29.232388
1256	105	13.5	2026-03-03	\N	2026-03-31 06:08:29.234715
1257	105	13.7	2026-03-10	\N	2026-03-31 06:08:29.236867
1258	105	13.7	2026-03-17	\N	2026-03-31 06:08:29.238971
1259	105	13.8	2026-03-24	\N	2026-03-31 06:08:29.241214
1260	105	14	2026-03-31	Most recent clinic measurement	2026-03-31 06:08:29.243554
1261	106	14.8	2026-01-13	\N	2026-03-31 06:08:29.3635
1262	106	14.7	2026-01-20	\N	2026-03-31 06:08:29.365718
1263	106	14.7	2026-01-27	\N	2026-03-31 06:08:29.368018
1264	106	14.6	2026-02-03	\N	2026-03-31 06:08:29.36968
1265	106	14.7	2026-02-10	\N	2026-03-31 06:08:29.371809
1266	106	14.6	2026-02-17	Mid-protocol review	2026-03-31 06:08:29.37428
1267	106	14.5	2026-02-24	\N	2026-03-31 06:08:29.377169
1268	106	14.4	2026-03-03	\N	2026-03-31 06:08:29.379393
1269	106	14.4	2026-03-10	\N	2026-03-31 06:08:29.381249
1270	106	14.4	2026-03-17	\N	2026-03-31 06:08:29.38359
1271	106	14.3	2026-03-24	\N	2026-03-31 06:08:29.385718
1272	106	14.2	2026-03-31	Most recent clinic measurement	2026-03-31 06:08:29.388044
1273	107	11.2	2026-01-13	\N	2026-03-31 06:08:29.50256
1274	107	11.4	2026-01-20	\N	2026-03-31 06:08:29.505085
1275	107	11.5	2026-01-27	\N	2026-03-31 06:08:29.507431
1276	107	11.7	2026-02-03	\N	2026-03-31 06:08:29.509899
1277	107	11.8	2026-02-10	\N	2026-03-31 06:08:29.512632
1278	107	11.9	2026-02-17	Mid-protocol review	2026-03-31 06:08:29.515404
1279	107	12.1	2026-02-24	\N	2026-03-31 06:08:29.51765
1280	107	12.3	2026-03-03	\N	2026-03-31 06:08:29.519543
1281	107	12.4	2026-03-10	\N	2026-03-31 06:08:29.522061
1282	107	12.5	2026-03-17	\N	2026-03-31 06:08:29.524179
1283	107	12.7	2026-03-24	\N	2026-03-31 06:08:29.526267
1284	107	12.8	2026-03-31	Most recent clinic measurement	2026-03-31 06:08:29.528342
1285	108	18.7	2026-01-13	\N	2026-03-31 06:08:29.644738
1286	108	18.8	2026-01-20	\N	2026-03-31 06:08:29.646975
1287	108	18.8	2026-01-27	\N	2026-03-31 06:08:29.64967
1288	108	19	2026-02-03	\N	2026-03-31 06:08:29.652091
1289	108	19.1	2026-02-10	\N	2026-03-31 06:08:29.654341
1290	108	19.3	2026-02-17	Mid-protocol review	2026-03-31 06:08:29.656781
1291	108	19.5	2026-02-24	\N	2026-03-31 06:08:29.659153
1292	108	19.6	2026-03-03	\N	2026-03-31 06:08:29.661744
1293	108	19.7	2026-03-10	\N	2026-03-31 06:08:29.665066
1294	108	20	2026-03-17	\N	2026-03-31 06:08:29.667103
1295	108	20.1	2026-03-24	\N	2026-03-31 06:08:29.669577
1296	108	20.3	2026-03-31	Most recent clinic measurement	2026-03-31 06:08:29.672337
1297	109	12.9	2026-01-13	\N	2026-03-31 06:08:29.888127
1298	109	13	2026-01-20	\N	2026-03-31 06:08:29.890356
1299	109	12.8	2026-01-27	\N	2026-03-31 06:08:29.892596
1300	109	12.8	2026-02-03	\N	2026-03-31 06:08:29.894736
1301	109	12.8	2026-02-10	\N	2026-03-31 06:08:29.897207
1302	109	12.7	2026-02-17	Mid-protocol review	2026-03-31 06:08:29.900031
1303	109	12.7	2026-02-24	\N	2026-03-31 06:08:29.902322
1304	109	12.6	2026-03-03	\N	2026-03-31 06:08:29.904641
1305	109	12.5	2026-03-10	\N	2026-03-31 06:08:29.90719
1306	109	12.6	2026-03-17	\N	2026-03-31 06:08:29.909477
1307	109	12.4	2026-03-24	\N	2026-03-31 06:08:29.911801
1308	109	12.5	2026-03-31	Most recent clinic measurement	2026-03-31 06:08:29.914143
1309	110	15.2	2026-01-13	\N	2026-03-31 06:08:30.038523
1310	110	15.2	2026-01-20	\N	2026-03-31 06:08:30.040836
1311	110	15.1	2026-01-27	\N	2026-03-31 06:08:30.042676
1312	110	15.1	2026-02-03	\N	2026-03-31 06:08:30.044954
1313	110	14.9	2026-02-10	\N	2026-03-31 06:08:30.04714
1314	110	14.9	2026-02-17	Mid-protocol review	2026-03-31 06:08:30.049429
1315	110	15	2026-02-24	\N	2026-03-31 06:08:30.051495
1316	110	14.9	2026-03-03	\N	2026-03-31 06:08:30.053866
1317	110	14.9	2026-03-10	\N	2026-03-31 06:08:30.056242
1318	110	14.8	2026-03-17	\N	2026-03-31 06:08:30.058621
1319	110	14.7	2026-03-24	\N	2026-03-31 06:08:30.061099
1320	110	14.6	2026-03-31	Most recent clinic measurement	2026-03-31 06:08:30.06303
1321	111	10.7	2026-01-13	\N	2026-03-31 06:08:30.173983
1322	111	11	2026-01-20	\N	2026-03-31 06:08:30.176852
1323	111	11.1	2026-01-27	\N	2026-03-31 06:08:30.178772
1324	111	11.2	2026-02-03	\N	2026-03-31 06:08:30.18125
1325	111	11.4	2026-02-10	\N	2026-03-31 06:08:30.183496
1326	111	11.5	2026-02-17	Mid-protocol review	2026-03-31 06:08:30.185633
1327	111	11.8	2026-02-24	\N	2026-03-31 06:08:30.18753
1328	111	11.9	2026-03-03	\N	2026-03-31 06:08:30.189618
1329	111	12.1	2026-03-10	\N	2026-03-31 06:08:30.191732
1330	111	12.1	2026-03-17	\N	2026-03-31 06:08:30.194059
1331	111	12.4	2026-03-24	\N	2026-03-31 06:08:30.196264
1332	111	12.5	2026-03-31	Most recent clinic measurement	2026-03-31 06:08:30.198306
1333	112	20.3	2026-01-13	\N	2026-03-31 06:08:30.310127
1334	112	20.3	2026-01-20	\N	2026-03-31 06:08:30.312239
1335	112	20.3	2026-01-27	\N	2026-03-31 06:08:30.313933
1336	112	20.3	2026-02-03	\N	2026-03-31 06:08:30.316479
1337	112	20.1	2026-02-10	\N	2026-03-31 06:08:30.318702
1338	112	20.1	2026-02-17	Mid-protocol review	2026-03-31 06:08:30.320482
1339	112	20.2	2026-02-24	\N	2026-03-31 06:08:30.322599
1340	112	20.1	2026-03-03	\N	2026-03-31 06:08:30.325045
1341	112	19.9	2026-03-10	\N	2026-03-31 06:08:30.327432
1342	112	20	2026-03-17	\N	2026-03-31 06:08:30.330129
1343	112	19.8	2026-03-24	\N	2026-03-31 06:08:30.33241
1344	112	19.9	2026-03-31	Most recent clinic measurement	2026-03-31 06:08:30.334782
1345	113	13.6	2026-01-13	\N	2026-03-31 06:08:30.447859
1346	113	13.7	2026-01-20	\N	2026-03-31 06:08:30.450103
1347	113	13.9	2026-01-27	\N	2026-03-31 06:08:30.452768
1348	113	14.1	2026-02-03	\N	2026-03-31 06:08:30.454767
1349	113	14.1	2026-02-10	\N	2026-03-31 06:08:30.456725
1350	113	14.4	2026-02-17	Mid-protocol review	2026-03-31 06:08:30.45882
1351	113	14.4	2026-02-24	\N	2026-03-31 06:08:30.461029
1352	113	14.7	2026-03-03	\N	2026-03-31 06:08:30.463184
1353	113	14.8	2026-03-10	\N	2026-03-31 06:08:30.465463
1354	113	14.9	2026-03-17	\N	2026-03-31 06:08:30.467536
1355	113	15.1	2026-03-24	\N	2026-03-31 06:08:30.469662
1356	113	15.2	2026-03-31	Most recent clinic measurement	2026-03-31 06:08:30.471893
1357	114	19.3	2026-01-13	\N	2026-03-31 06:08:30.581271
1358	114	19.2	2026-01-20	\N	2026-03-31 06:08:30.58347
1359	114	19.1	2026-01-27	\N	2026-03-31 06:08:30.585677
1360	114	19	2026-02-03	\N	2026-03-31 06:08:30.588151
1361	114	19	2026-02-10	\N	2026-03-31 06:08:30.590717
1362	114	18.9	2026-02-17	Mid-protocol review	2026-03-31 06:08:30.593509
1363	114	19	2026-02-24	\N	2026-03-31 06:08:30.595651
1364	114	18.8	2026-03-03	\N	2026-03-31 06:08:30.597812
1365	114	18.8	2026-03-10	\N	2026-03-31 06:08:30.599925
1366	114	18.7	2026-03-17	\N	2026-03-31 06:08:30.60256
1367	114	18.7	2026-03-24	\N	2026-03-31 06:08:30.604675
1368	114	18.6	2026-03-31	Most recent clinic measurement	2026-03-31 06:08:30.606518
1369	115	9.5	2026-01-13	\N	2026-03-31 06:08:30.717928
1370	115	9.6	2026-01-20	\N	2026-03-31 06:08:30.720226
1371	115	9.7	2026-01-27	\N	2026-03-31 06:08:30.722405
1372	115	9.9	2026-02-03	\N	2026-03-31 06:08:30.724638
1373	115	9.9	2026-02-10	\N	2026-03-31 06:08:30.726821
1374	115	10.2	2026-02-17	Mid-protocol review	2026-03-31 06:08:30.729109
1375	115	10.4	2026-02-24	\N	2026-03-31 06:08:30.731277
1376	115	10.4	2026-03-03	\N	2026-03-31 06:08:30.733406
1377	115	10.6	2026-03-10	\N	2026-03-31 06:08:30.73572
1378	115	10.8	2026-03-17	\N	2026-03-31 06:08:30.738116
1379	115	10.8	2026-03-24	\N	2026-03-31 06:08:30.74095
1380	115	11.1	2026-03-31	Most recent clinic measurement	2026-03-31 06:08:30.743098
1381	116	16	2026-01-13	\N	2026-03-31 06:08:30.861165
1382	116	16	2026-01-20	\N	2026-03-31 06:08:30.863354
1383	116	15.8	2026-01-27	\N	2026-03-31 06:08:30.865891
1384	116	15.9	2026-02-03	\N	2026-03-31 06:08:30.867908
1385	116	15.8	2026-02-10	\N	2026-03-31 06:08:30.870198
1386	116	15.7	2026-02-17	Mid-protocol review	2026-03-31 06:08:30.872497
1387	116	15.7	2026-02-24	\N	2026-03-31 06:08:30.874544
1388	116	15.7	2026-03-03	\N	2026-03-31 06:08:30.876269
1389	116	15.6	2026-03-10	\N	2026-03-31 06:08:30.878874
1390	116	15.6	2026-03-17	\N	2026-03-31 06:08:30.881386
1391	116	15.6	2026-03-24	\N	2026-03-31 06:08:30.883277
1392	116	15.4	2026-03-31	Most recent clinic measurement	2026-03-31 06:08:30.885158
1393	117	11.8	2026-01-13	\N	2026-03-31 06:08:30.998818
1394	117	12	2026-01-20	\N	2026-03-31 06:08:31.001435
1395	117	12.2	2026-01-27	\N	2026-03-31 06:08:31.003756
1396	117	12.3	2026-02-03	\N	2026-03-31 06:08:31.006193
1397	117	12.4	2026-02-10	\N	2026-03-31 06:08:31.008108
1398	117	12.6	2026-02-17	Mid-protocol review	2026-03-31 06:08:31.075319
1399	117	12.8	2026-02-24	\N	2026-03-31 06:08:31.077785
1400	117	12.9	2026-03-03	\N	2026-03-31 06:08:31.080592
1401	117	13	2026-03-10	\N	2026-03-31 06:08:31.08258
1402	117	13.1	2026-03-17	\N	2026-03-31 06:08:31.084944
1403	117	13.3	2026-03-24	\N	2026-03-31 06:08:31.087337
1404	117	13.4	2026-03-31	Most recent clinic measurement	2026-03-31 06:08:31.089849
1405	118	21.1	2026-01-13	\N	2026-03-31 06:08:31.214597
1406	118	21	2026-01-20	\N	2026-03-31 06:08:31.216845
1407	118	20.9	2026-01-27	\N	2026-03-31 06:08:31.219134
1408	118	20.8	2026-02-03	\N	2026-03-31 06:08:31.220932
1409	118	20.8	2026-02-10	\N	2026-03-31 06:08:31.223321
1410	118	20.8	2026-02-17	Mid-protocol review	2026-03-31 06:08:31.225607
1411	118	20.6	2026-02-24	\N	2026-03-31 06:08:31.228006
1412	118	20.7	2026-03-03	\N	2026-03-31 06:08:31.230263
1413	118	20.7	2026-03-10	\N	2026-03-31 06:08:31.232457
1414	118	20.6	2026-03-17	\N	2026-03-31 06:08:31.234239
1415	118	20.6	2026-03-24	\N	2026-03-31 06:08:31.236515
1416	118	20.4	2026-03-31	Most recent clinic measurement	2026-03-31 06:08:31.238365
1417	119	13.9	2026-01-13	\N	2026-03-31 06:08:31.355137
1418	119	13.9	2026-01-20	\N	2026-03-31 06:08:31.357549
1419	119	14.2	2026-01-27	\N	2026-03-31 06:08:31.360064
1420	119	14.2	2026-02-03	\N	2026-03-31 06:08:31.36241
1421	119	14.3	2026-02-10	\N	2026-03-31 06:08:31.364669
1422	119	14.5	2026-02-17	Mid-protocol review	2026-03-31 06:08:31.367488
1423	119	14.8	2026-02-24	\N	2026-03-31 06:08:31.369971
1424	119	14.8	2026-03-03	\N	2026-03-31 06:08:31.372331
1425	119	14.9	2026-03-10	\N	2026-03-31 06:08:31.374658
1426	119	15.2	2026-03-17	\N	2026-03-31 06:08:31.377175
1427	119	15.3	2026-03-24	\N	2026-03-31 06:08:31.37959
1428	119	15.5	2026-03-31	Most recent clinic measurement	2026-03-31 06:08:31.381569
1429	120	15.6	2026-01-13	\N	2026-03-31 06:08:31.495639
1430	120	15.5	2026-01-20	\N	2026-03-31 06:08:31.498069
1431	120	15.6	2026-01-27	\N	2026-03-31 06:08:31.50009
1432	120	15.5	2026-02-03	\N	2026-03-31 06:08:31.502484
1433	120	15.5	2026-02-10	\N	2026-03-31 06:08:31.505211
1434	120	15.3	2026-02-17	Mid-protocol review	2026-03-31 06:08:31.50756
1435	120	15.3	2026-02-24	\N	2026-03-31 06:08:31.509553
1436	120	15.2	2026-03-03	\N	2026-03-31 06:08:31.511953
1437	120	15.2	2026-03-10	\N	2026-03-31 06:08:31.514389
1438	120	15.2	2026-03-17	\N	2026-03-31 06:08:31.516695
1439	120	15.1	2026-03-24	\N	2026-03-31 06:08:31.519067
1440	120	15	2026-03-31	Most recent clinic measurement	2026-03-31 06:08:31.521513
1441	121	10.7	2026-01-13	\N	2026-03-31 06:08:31.652267
1442	121	10.8	2026-01-20	\N	2026-03-31 06:08:31.654657
1443	121	10.9	2026-01-27	\N	2026-03-31 06:08:31.657092
1444	121	11	2026-02-03	\N	2026-03-31 06:08:31.659394
1445	121	11.2	2026-02-10	\N	2026-03-31 06:08:31.661314
1446	121	11.4	2026-02-17	Mid-protocol review	2026-03-31 06:08:31.664108
1447	121	11.5	2026-02-24	\N	2026-03-31 06:08:31.666415
1448	121	11.7	2026-03-03	\N	2026-03-31 06:08:31.66877
1449	121	11.9	2026-03-10	\N	2026-03-31 06:08:31.671433
1450	121	11.9	2026-03-17	\N	2026-03-31 06:08:31.675047
1451	121	12.1	2026-03-24	\N	2026-03-31 06:08:31.677187
1452	121	12.2	2026-03-31	Most recent clinic measurement	2026-03-31 06:08:31.679018
1453	122	19.8	2026-01-13	\N	2026-03-31 06:08:31.793855
1454	122	19.7	2026-01-20	\N	2026-03-31 06:08:31.796095
1455	122	19.7	2026-01-27	\N	2026-03-31 06:08:31.798212
1456	122	19.7	2026-02-03	\N	2026-03-31 06:08:31.800152
1457	122	19.6	2026-02-10	\N	2026-03-31 06:08:31.802372
1458	122	19.5	2026-02-17	Mid-protocol review	2026-03-31 06:08:31.804282
1459	122	19.5	2026-02-24	\N	2026-03-31 06:08:31.807006
1460	122	19.5	2026-03-03	\N	2026-03-31 06:08:31.80921
1461	122	19.4	2026-03-10	\N	2026-03-31 06:08:31.811342
1462	122	19.4	2026-03-17	\N	2026-03-31 06:08:31.813585
1463	122	19.4	2026-03-24	\N	2026-03-31 06:08:31.815605
1464	122	19.3	2026-03-31	Most recent clinic measurement	2026-03-31 06:08:31.817457
1465	123	11.9	2026-01-13	\N	2026-03-31 06:08:31.929689
1466	123	12.1	2026-01-20	\N	2026-03-31 06:08:31.932018
1467	123	12.3	2026-01-27	\N	2026-03-31 06:08:31.933896
1468	123	12.5	2026-02-03	\N	2026-03-31 06:08:31.935888
1469	123	12.6	2026-02-10	\N	2026-03-31 06:08:31.937752
1470	123	12.7	2026-02-17	Mid-protocol review	2026-03-31 06:08:31.940153
1471	123	12.8	2026-02-24	\N	2026-03-31 06:08:31.942074
1472	123	13	2026-03-03	\N	2026-03-31 06:08:31.944482
1473	123	13.2	2026-03-10	\N	2026-03-31 06:08:31.946688
1474	123	13.3	2026-03-17	\N	2026-03-31 06:08:31.949075
1475	123	13.4	2026-03-24	\N	2026-03-31 06:08:31.951196
1476	123	13.6	2026-03-31	Most recent clinic measurement	2026-03-31 06:08:31.954249
1477	124	9.9	2026-01-13	\N	2026-03-31 06:08:32.0695
1478	124	9.9	2026-01-20	\N	2026-03-31 06:08:32.071455
1479	124	10.1	2026-01-27	\N	2026-03-31 06:08:32.073937
1480	124	10.2	2026-02-03	\N	2026-03-31 06:08:32.076384
1481	124	10.3	2026-02-10	\N	2026-03-31 06:08:32.078898
1482	124	10.6	2026-02-17	Mid-protocol review	2026-03-31 06:08:32.081147
1483	124	10.7	2026-02-24	\N	2026-03-31 06:08:32.083148
1484	124	10.9	2026-03-03	\N	2026-03-31 06:08:32.085118
1485	124	10.9	2026-03-10	\N	2026-03-31 06:08:32.087162
1486	124	11.2	2026-03-17	\N	2026-03-31 06:08:32.089188
1487	124	11.4	2026-03-24	\N	2026-03-31 06:08:32.091197
1488	124	11.4	2026-03-31	Most recent clinic measurement	2026-03-31 06:08:32.093103
1489	125	14.4	2026-01-13	\N	2026-03-31 06:08:32.209469
1490	125	14.4	2026-01-20	\N	2026-03-31 06:08:32.211895
1491	125	14.2	2026-01-27	\N	2026-03-31 06:08:32.214231
1492	125	14.2	2026-02-03	\N	2026-03-31 06:08:32.216681
1493	125	14.2	2026-02-10	\N	2026-03-31 06:08:32.219009
1494	125	14.1	2026-02-17	Mid-protocol review	2026-03-31 06:08:32.221555
1495	125	14.1	2026-02-24	\N	2026-03-31 06:08:32.223512
1496	125	14.1	2026-03-03	\N	2026-03-31 06:08:32.226078
1497	125	14	2026-03-10	\N	2026-03-31 06:08:32.22802
1498	125	14	2026-03-17	\N	2026-03-31 06:08:32.230246
1499	125	13.9	2026-03-24	\N	2026-03-31 06:08:32.232024
1500	125	13.8	2026-03-31	Most recent clinic measurement	2026-03-31 06:08:32.233935
1501	126	22	2026-01-13	\N	2026-03-31 06:08:32.355136
1502	126	22.1	2026-01-20	\N	2026-03-31 06:08:32.357448
1503	126	22.2	2026-01-27	\N	2026-03-31 06:08:32.35989
1504	126	22.5	2026-02-03	\N	2026-03-31 06:08:32.361841
1505	126	22.5	2026-02-10	\N	2026-03-31 06:08:32.363908
1506	126	22.7	2026-02-17	Mid-protocol review	2026-03-31 06:08:32.365972
1507	126	22.9	2026-02-24	\N	2026-03-31 06:08:32.368124
1508	126	23	2026-03-03	\N	2026-03-31 06:08:32.370499
1509	126	23.3	2026-03-10	\N	2026-03-31 06:08:32.372513
1510	126	23.4	2026-03-17	\N	2026-03-31 06:08:32.374469
1511	126	23.6	2026-03-24	\N	2026-03-31 06:08:32.376918
1512	126	23.7	2026-03-31	Most recent clinic measurement	2026-03-31 06:08:32.380264
1513	127	10.3	2026-01-13	\N	2026-03-31 06:08:32.500544
1514	127	10.2	2026-01-20	\N	2026-03-31 06:08:32.503072
1515	127	10.1	2026-01-27	\N	2026-03-31 06:08:32.505187
1516	127	10	2026-02-03	\N	2026-03-31 06:08:32.507189
1517	127	10.1	2026-02-10	\N	2026-03-31 06:08:32.509504
1518	127	10	2026-02-17	Mid-protocol review	2026-03-31 06:08:32.511452
1519	127	9.8	2026-02-24	\N	2026-03-31 06:08:32.513522
1520	127	9.8	2026-03-03	\N	2026-03-31 06:08:32.515576
1521	127	9.8	2026-03-10	\N	2026-03-31 06:08:32.517913
1522	127	9.7	2026-03-17	\N	2026-03-31 06:08:32.519848
1523	127	9.8	2026-03-24	\N	2026-03-31 06:08:32.522116
1524	127	9.6	2026-03-31	Most recent clinic measurement	2026-03-31 06:08:32.524602
1525	128	13.4	2026-01-13	\N	2026-03-31 06:08:32.649572
1526	128	13.5	2026-01-20	\N	2026-03-31 06:08:32.652166
1527	128	13.8	2026-01-27	\N	2026-03-31 06:08:32.655346
1528	128	13.9	2026-02-03	\N	2026-03-31 06:08:32.657874
1529	128	14	2026-02-10	\N	2026-03-31 06:08:32.660482
1530	128	14.2	2026-02-17	Mid-protocol review	2026-03-31 06:08:32.663166
1531	128	14.3	2026-02-24	\N	2026-03-31 06:08:32.665732
1532	128	14.5	2026-03-03	\N	2026-03-31 06:08:32.668114
1533	128	14.7	2026-03-10	\N	2026-03-31 06:08:32.670526
1534	128	14.7	2026-03-17	\N	2026-03-31 06:08:32.672895
1535	128	14.9	2026-03-24	\N	2026-03-31 06:08:32.67581
1536	128	15.1	2026-03-31	Most recent clinic measurement	2026-03-31 06:08:32.67904
1537	129	17.5	2026-01-13	\N	2026-03-31 06:08:32.800582
1538	129	17.8	2026-01-20	\N	2026-03-31 06:08:32.803133
1539	129	18	2026-01-27	\N	2026-03-31 06:08:32.805126
1540	129	18.1	2026-02-03	\N	2026-03-31 06:08:32.807131
1541	129	18.2	2026-02-10	\N	2026-03-31 06:08:32.81003
1542	129	18.4	2026-02-17	Mid-protocol review	2026-03-31 06:08:32.812607
1543	129	18.6	2026-02-24	\N	2026-03-31 06:08:32.815004
1544	129	18.7	2026-03-03	\N	2026-03-31 06:08:32.817381
1545	129	18.8	2026-03-10	\N	2026-03-31 06:08:32.819659
1546	129	19	2026-03-17	\N	2026-03-31 06:08:32.82204
1547	129	19.2	2026-03-24	\N	2026-03-31 06:08:32.823845
1548	129	19.2	2026-03-31	Most recent clinic measurement	2026-03-31 06:08:32.82617
1549	130	14	2026-01-13	\N	2026-03-31 06:08:32.950072
1550	130	13.9	2026-01-20	\N	2026-03-31 06:08:32.952036
1551	130	13.9	2026-01-27	\N	2026-03-31 06:08:32.954161
1552	130	13.8	2026-02-03	\N	2026-03-31 06:08:32.956321
1553	130	13.7	2026-02-10	\N	2026-03-31 06:08:32.959429
1554	130	13.8	2026-02-17	Mid-protocol review	2026-03-31 06:08:32.961652
1555	130	13.7	2026-02-24	\N	2026-03-31 06:08:32.96366
1556	130	13.6	2026-03-03	\N	2026-03-31 06:08:32.96612
1557	130	13.5	2026-03-10	\N	2026-03-31 06:08:32.968201
1558	130	13.5	2026-03-17	\N	2026-03-31 06:08:32.970193
1559	130	13.6	2026-03-24	\N	2026-03-31 06:08:32.972329
1560	130	13.5	2026-03-31	Most recent clinic measurement	2026-03-31 06:08:32.974311
1561	131	11.3	2026-01-13	\N	2026-03-31 06:08:33.091235
1562	131	11.4	2026-01-20	\N	2026-03-31 06:08:33.093269
1563	131	11.2	2026-01-27	\N	2026-03-31 06:08:33.095216
1564	131	11.2	2026-02-03	\N	2026-03-31 06:08:33.097142
1565	131	11.1	2026-02-10	\N	2026-03-31 06:08:33.09905
1566	131	11.1	2026-02-17	Mid-protocol review	2026-03-31 06:08:33.100933
1567	131	11.2	2026-02-24	\N	2026-03-31 06:08:33.103282
1568	131	11	2026-03-03	\N	2026-03-31 06:08:33.10582
1569	131	10.9	2026-03-10	\N	2026-03-31 06:08:33.108094
1570	131	10.9	2026-03-17	\N	2026-03-31 06:08:33.110787
1571	131	10.9	2026-03-24	\N	2026-03-31 06:08:33.113114
1572	131	10.8	2026-03-31	Most recent clinic measurement	2026-03-31 06:08:33.115848
1573	132	21.6	2026-01-13	\N	2026-03-31 06:08:33.229895
1574	132	21.7	2026-01-20	\N	2026-03-31 06:08:33.232595
1575	132	22	2026-01-27	\N	2026-03-31 06:08:33.235294
1576	132	22	2026-02-03	\N	2026-03-31 06:08:33.237614
1577	132	22.1	2026-02-10	\N	2026-03-31 06:08:33.240129
1578	132	22.4	2026-02-17	Mid-protocol review	2026-03-31 06:08:33.242021
1579	132	22.5	2026-02-24	\N	2026-03-31 06:08:33.244434
1580	132	22.7	2026-03-03	\N	2026-03-31 06:08:33.246684
1581	132	22.7	2026-03-10	\N	2026-03-31 06:08:33.249089
1582	132	23	2026-03-17	\N	2026-03-31 06:08:33.251525
1583	132	23.1	2026-03-24	\N	2026-03-31 06:08:33.254012
1584	132	23.3	2026-03-31	Most recent clinic measurement	2026-03-31 06:08:33.2562
1585	133	8.9	2026-01-13	\N	2026-03-31 06:08:33.36944
1586	133	9	2026-01-20	\N	2026-03-31 06:08:33.371881
1587	133	8.9	2026-01-27	\N	2026-03-31 06:08:33.374375
1588	133	8.8	2026-02-03	\N	2026-03-31 06:08:33.3766
1589	133	8.7	2026-02-10	\N	2026-03-31 06:08:33.379004
1590	133	8.7	2026-02-17	Mid-protocol review	2026-03-31 06:08:33.381064
1591	133	8.7	2026-02-24	\N	2026-03-31 06:08:33.38308
1592	133	8.7	2026-03-03	\N	2026-03-31 06:08:33.38508
1593	133	8.6	2026-03-10	\N	2026-03-31 06:08:33.386966
1594	133	8.6	2026-03-17	\N	2026-03-31 06:08:33.389408
1595	133	8.5	2026-03-24	\N	2026-03-31 06:08:33.391834
1596	133	8.5	2026-03-31	Most recent clinic measurement	2026-03-31 06:08:33.394532
1597	134	13.3	2026-01-13	\N	2026-03-31 06:08:33.506078
1598	134	13.3	2026-01-20	\N	2026-03-31 06:08:33.508038
1599	134	13.6	2026-01-27	\N	2026-03-31 06:08:33.510371
1600	134	13.7	2026-02-03	\N	2026-03-31 06:08:33.512417
1601	134	13.9	2026-02-10	\N	2026-03-31 06:08:33.514577
1602	134	14	2026-02-17	Mid-protocol review	2026-03-31 06:08:33.516479
1603	134	14.1	2026-02-24	\N	2026-03-31 06:08:33.519254
1604	134	14.2	2026-03-03	\N	2026-03-31 06:08:33.521586
1605	134	14.3	2026-03-10	\N	2026-03-31 06:08:33.52367
1606	134	14.6	2026-03-17	\N	2026-03-31 06:08:33.525745
1607	134	14.7	2026-03-24	\N	2026-03-31 06:08:33.528012
1608	134	14.8	2026-03-31	Most recent clinic measurement	2026-03-31 06:08:33.530588
1609	135	7.1	2026-01-13	\N	2026-03-31 06:08:33.649641
1610	135	7.1	2026-01-20	\N	2026-03-31 06:08:33.651605
1611	135	7.1	2026-01-27	\N	2026-03-31 06:08:33.65381
1612	135	7	2026-02-03	\N	2026-03-31 06:08:33.656157
1613	135	6.9	2026-02-10	\N	2026-03-31 06:08:33.658065
1614	135	6.9	2026-02-17	Mid-protocol review	2026-03-31 06:08:33.660455
1615	135	6.9	2026-02-24	\N	2026-03-31 06:08:33.662474
1616	135	6.8	2026-03-03	\N	2026-03-31 06:08:33.665171
1617	135	6.9	2026-03-10	\N	2026-03-31 06:08:33.667284
1618	135	6.8	2026-03-17	\N	2026-03-31 06:08:33.66965
1619	135	6.7	2026-03-24	\N	2026-03-31 06:08:33.6716
1620	135	6.7	2026-03-31	Most recent clinic measurement	2026-03-31 06:08:33.673957
1621	136	10.4	2026-01-13	\N	2026-03-31 06:08:33.788583
1622	136	10.5	2026-01-20	\N	2026-03-31 06:08:33.790424
1623	136	10.5	2026-01-27	\N	2026-03-31 06:08:33.79291
1624	136	10.4	2026-02-03	\N	2026-03-31 06:08:33.795656
1625	136	10.4	2026-02-10	\N	2026-03-31 06:08:33.798016
1626	136	10.3	2026-02-17	Mid-protocol review	2026-03-31 06:08:33.799857
1627	136	10.2	2026-02-24	\N	2026-03-31 06:08:33.802156
1628	136	10.2	2026-03-03	\N	2026-03-31 06:08:33.803986
1629	136	10.1	2026-03-10	\N	2026-03-31 06:08:33.806544
1630	136	10.1	2026-03-17	\N	2026-03-31 06:08:33.809179
1631	136	9.9	2026-03-24	\N	2026-03-31 06:08:33.811284
1632	136	10	2026-03-31	Most recent clinic measurement	2026-03-31 06:08:33.813435
1633	137	12.8	2026-01-13	\N	2026-03-31 06:08:33.928944
1634	137	12.9	2026-01-20	\N	2026-03-31 06:08:33.930891
1635	137	13.2	2026-01-27	\N	2026-03-31 06:08:33.932693
1636	137	13.2	2026-02-03	\N	2026-03-31 06:08:33.935037
1637	137	13.3	2026-02-10	\N	2026-03-31 06:08:33.937634
1638	137	13.5	2026-02-17	Mid-protocol review	2026-03-31 06:08:33.940072
1639	137	13.7	2026-02-24	\N	2026-03-31 06:08:33.942475
1640	137	13.9	2026-03-03	\N	2026-03-31 06:08:33.944505
1641	137	14.1	2026-03-10	\N	2026-03-31 06:08:33.946703
1642	137	14.1	2026-03-17	\N	2026-03-31 06:08:33.949056
1643	137	14.4	2026-03-24	\N	2026-03-31 06:08:33.951465
1644	137	14.4	2026-03-31	Most recent clinic measurement	2026-03-31 06:08:33.953926
1645	138	20	2026-01-13	\N	2026-03-31 06:08:34.071935
1646	138	20	2026-01-20	\N	2026-03-31 06:08:34.073845
1647	138	20	2026-01-27	\N	2026-03-31 06:08:34.076329
1648	138	20	2026-02-03	\N	2026-03-31 06:08:34.078572
1649	138	20	2026-02-10	\N	2026-03-31 06:08:34.081265
1650	138	19.8	2026-02-17	Mid-protocol review	2026-03-31 06:08:34.083598
1651	138	19.7	2026-02-24	\N	2026-03-31 06:08:34.086155
1652	138	19.7	2026-03-03	\N	2026-03-31 06:08:34.089051
1653	138	19.8	2026-03-10	\N	2026-03-31 06:08:34.091089
1654	138	19.7	2026-03-17	\N	2026-03-31 06:08:34.09317
1655	138	19.5	2026-03-24	\N	2026-03-31 06:08:34.095564
1656	138	19.5	2026-03-31	Most recent clinic measurement	2026-03-31 06:08:34.097689
1657	139	13.4	2026-01-13	\N	2026-03-31 06:08:34.226169
1658	139	13.7	2026-01-20	\N	2026-03-31 06:08:34.228794
1659	139	13.8	2026-01-27	\N	2026-03-31 06:08:34.23141
1660	139	14	2026-02-03	\N	2026-03-31 06:08:34.233722
1661	139	14.1	2026-02-10	\N	2026-03-31 06:08:34.235988
1662	139	14.2	2026-02-17	Mid-protocol review	2026-03-31 06:08:34.238322
1663	139	14.4	2026-02-24	\N	2026-03-31 06:08:34.240636
1664	139	14.6	2026-03-03	\N	2026-03-31 06:08:34.243026
1665	139	14.8	2026-03-10	\N	2026-03-31 06:08:34.245655
1666	139	14.9	2026-03-17	\N	2026-03-31 06:08:34.248512
1667	139	14.9	2026-03-24	\N	2026-03-31 06:08:34.251468
1668	139	15.1	2026-03-31	Most recent clinic measurement	2026-03-31 06:08:34.254162
1669	140	16.4	2026-01-13	\N	2026-03-31 06:08:34.376984
1670	140	16.3	2026-01-20	\N	2026-03-31 06:08:34.379153
1671	140	16.2	2026-01-27	\N	2026-03-31 06:08:34.38107
1672	140	16.2	2026-02-03	\N	2026-03-31 06:08:34.383968
1673	140	16.3	2026-02-10	\N	2026-03-31 06:08:34.386247
1674	140	16.2	2026-02-17	Mid-protocol review	2026-03-31 06:08:34.388308
1675	140	16.1	2026-02-24	\N	2026-03-31 06:08:34.390231
1676	140	16.1	2026-03-03	\N	2026-03-31 06:08:34.392332
1677	140	16.1	2026-03-10	\N	2026-03-31 06:08:34.394896
1678	140	15.9	2026-03-17	\N	2026-03-31 06:08:34.397342
1679	140	16	2026-03-24	\N	2026-03-31 06:08:34.399579
1680	140	15.9	2026-03-31	Most recent clinic measurement	2026-03-31 06:08:34.402183
1681	141	10.8	2026-01-13	\N	2026-03-31 06:08:34.520737
1682	141	11.1	2026-01-20	\N	2026-03-31 06:08:34.522703
1683	141	11.2	2026-01-27	\N	2026-03-31 06:08:34.52506
1684	141	11.4	2026-02-03	\N	2026-03-31 06:08:34.526989
1685	141	11.4	2026-02-10	\N	2026-03-31 06:08:34.529024
1686	141	11.7	2026-02-17	Mid-protocol review	2026-03-31 06:08:34.530986
1687	141	11.7	2026-02-24	\N	2026-03-31 06:08:34.533312
1688	141	11.9	2026-03-03	\N	2026-03-31 06:08:34.53534
1689	141	12.1	2026-03-10	\N	2026-03-31 06:08:34.537563
1690	141	12.2	2026-03-17	\N	2026-03-31 06:08:34.539953
1691	141	12.3	2026-03-24	\N	2026-03-31 06:08:34.542999
1692	141	12.6	2026-03-31	Most recent clinic measurement	2026-03-31 06:08:34.544795
1693	142	22.8	2026-01-13	\N	2026-03-31 06:08:34.663208
1694	142	22.8	2026-01-20	\N	2026-03-31 06:08:34.665351
1695	142	22.8	2026-01-27	\N	2026-03-31 06:08:34.667371
1696	142	22.7	2026-02-03	\N	2026-03-31 06:08:34.670297
1697	142	22.6	2026-02-10	\N	2026-03-31 06:08:34.672395
1698	142	22.6	2026-02-17	Mid-protocol review	2026-03-31 06:08:34.675087
1699	142	22.5	2026-02-24	\N	2026-03-31 06:08:34.67722
1700	142	22.5	2026-03-03	\N	2026-03-31 06:08:34.680538
1701	142	22.4	2026-03-10	\N	2026-03-31 06:08:34.683014
1702	142	22.3	2026-03-17	\N	2026-03-31 06:08:34.685343
1703	142	22.3	2026-03-24	\N	2026-03-31 06:08:34.687228
1704	142	22.2	2026-03-31	Most recent clinic measurement	2026-03-31 06:08:34.689641
1705	143	9.2	2026-01-13	\N	2026-03-31 06:08:34.80369
1706	143	9	2026-01-20	\N	2026-03-31 06:08:34.806085
1707	143	9.1	2026-01-27	\N	2026-03-31 06:08:34.808227
1708	143	9	2026-02-03	\N	2026-03-31 06:08:34.810295
1709	143	8.8	2026-02-10	\N	2026-03-31 06:08:34.812935
1710	143	8.8	2026-02-17	Mid-protocol review	2026-03-31 06:08:34.815544
1711	143	8.8	2026-02-24	\N	2026-03-31 06:08:34.817754
1712	143	8.8	2026-03-03	\N	2026-03-31 06:08:34.819699
1713	143	8.7	2026-03-10	\N	2026-03-31 06:08:34.821774
1714	143	8.6	2026-03-17	\N	2026-03-31 06:08:34.82374
1715	143	8.5	2026-03-24	\N	2026-03-31 06:08:34.826339
1716	143	8.5	2026-03-31	Most recent clinic measurement	2026-03-31 06:08:34.828212
1717	144	15.6	2026-01-13	\N	2026-03-31 06:08:34.948091
1718	144	15.8	2026-01-20	\N	2026-03-31 06:08:34.950288
1719	144	16	2026-01-27	\N	2026-03-31 06:08:34.952549
1720	144	16.1	2026-02-03	\N	2026-03-31 06:08:34.954762
1721	144	16.3	2026-02-10	\N	2026-03-31 06:08:34.957143
1722	144	16.5	2026-02-17	Mid-protocol review	2026-03-31 06:08:34.960208
1723	144	16.7	2026-02-24	\N	2026-03-31 06:08:34.962527
1724	144	16.8	2026-03-03	\N	2026-03-31 06:08:34.964994
1725	144	16.8	2026-03-10	\N	2026-03-31 06:08:34.967099
1726	144	17	2026-03-17	\N	2026-03-31 06:08:34.969154
1727	144	17.1	2026-03-24	\N	2026-03-31 06:08:34.971063
1728	144	17.3	2026-03-31	Most recent clinic measurement	2026-03-31 06:08:34.973193
1729	145	12.2	2026-01-13	\N	2026-03-31 06:08:35.121592
1730	145	12.3	2026-01-20	\N	2026-03-31 06:08:35.124785
1731	145	12.1	2026-01-27	\N	2026-03-31 06:08:35.127808
1732	145	12.2	2026-02-03	\N	2026-03-31 06:08:35.130899
1733	145	12.1	2026-02-10	\N	2026-03-31 06:08:35.133597
1734	145	12.1	2026-02-17	Mid-protocol review	2026-03-31 06:08:35.13678
1735	145	12	2026-02-24	\N	2026-03-31 06:08:35.139383
1736	145	12	2026-03-03	\N	2026-03-31 06:08:35.142238
1737	145	11.9	2026-03-10	\N	2026-03-31 06:08:35.144699
1738	145	11.8	2026-03-17	\N	2026-03-31 06:08:35.149148
1739	145	11.8	2026-03-24	\N	2026-03-31 06:08:35.153078
1740	145	11.8	2026-03-31	Most recent clinic measurement	2026-03-31 06:08:35.155341
1741	146	19.6	2026-01-13	\N	2026-03-31 06:08:35.275684
1742	146	19.6	2026-01-20	\N	2026-03-31 06:08:35.277761
1743	146	19.8	2026-01-27	\N	2026-03-31 06:08:35.279767
1744	146	19.9	2026-02-03	\N	2026-03-31 06:08:35.282625
1745	146	20.1	2026-02-10	\N	2026-03-31 06:08:35.2858
1746	146	20.3	2026-02-17	Mid-protocol review	2026-03-31 06:08:35.288003
1747	146	20.3	2026-02-24	\N	2026-03-31 06:08:35.29039
1748	146	20.5	2026-03-03	\N	2026-03-31 06:08:35.292665
1749	146	20.7	2026-03-10	\N	2026-03-31 06:08:35.294454
1750	146	20.8	2026-03-17	\N	2026-03-31 06:08:35.296467
1751	146	20.9	2026-03-24	\N	2026-03-31 06:08:35.298734
1752	146	21.2	2026-03-31	Most recent clinic measurement	2026-03-31 06:08:35.301073
1753	147	11.7	2026-01-13	\N	2026-03-31 06:08:35.417094
1754	147	11.6	2026-01-20	\N	2026-03-31 06:08:35.419407
1755	147	11.5	2026-01-27	\N	2026-03-31 06:08:35.421677
1756	147	11.5	2026-02-03	\N	2026-03-31 06:08:35.423928
1757	147	11.5	2026-02-10	\N	2026-03-31 06:08:35.426316
1758	147	11.3	2026-02-17	Mid-protocol review	2026-03-31 06:08:35.428233
1759	147	11.3	2026-02-24	\N	2026-03-31 06:08:35.430515
1760	147	11.3	2026-03-03	\N	2026-03-31 06:08:35.432389
1761	147	11.3	2026-03-10	\N	2026-03-31 06:08:35.435417
1762	147	11.1	2026-03-17	\N	2026-03-31 06:08:35.437654
1763	147	11.1	2026-03-24	\N	2026-03-31 06:08:35.439586
1764	147	11	2026-03-31	Most recent clinic measurement	2026-03-31 06:08:35.441605
1765	148	14.2	2026-01-13	\N	2026-03-31 06:08:35.5575
1766	148	14.5	2026-01-20	\N	2026-03-31 06:08:35.560048
1767	148	14.6	2026-01-27	\N	2026-03-31 06:08:35.563373
1768	148	14.8	2026-02-03	\N	2026-03-31 06:08:35.56613
1769	148	14.9	2026-02-10	\N	2026-03-31 06:08:35.568191
1770	148	15.1	2026-02-17	Mid-protocol review	2026-03-31 06:08:35.570252
1771	148	15.2	2026-02-24	\N	2026-03-31 06:08:35.572738
1772	148	15.4	2026-03-03	\N	2026-03-31 06:08:35.575183
1773	148	15.5	2026-03-10	\N	2026-03-31 06:08:35.577498
1774	148	15.7	2026-03-17	\N	2026-03-31 06:08:35.579896
1775	148	15.7	2026-03-24	\N	2026-03-31 06:08:35.582238
1776	148	16	2026-03-31	Most recent clinic measurement	2026-03-31 06:08:35.584977
1777	149	8.7	2026-01-13	\N	2026-03-31 06:08:35.704211
1778	149	8.8	2026-01-20	\N	2026-03-31 06:08:35.706816
1779	149	8.6	2026-01-27	\N	2026-03-31 06:08:35.71251
1780	149	8.6	2026-02-03	\N	2026-03-31 06:08:35.714874
1781	149	8.5	2026-02-10	\N	2026-03-31 06:08:35.71699
1782	149	8.5	2026-02-17	Mid-protocol review	2026-03-31 06:08:35.719372
1783	149	8.5	2026-02-24	\N	2026-03-31 06:08:35.724994
1784	149	8.4	2026-03-03	\N	2026-03-31 06:08:35.726927
1785	149	8.4	2026-03-10	\N	2026-03-31 06:08:35.729748
1786	149	8.4	2026-03-17	\N	2026-03-31 06:08:35.732726
1787	149	8.2	2026-03-24	\N	2026-03-31 06:08:35.735643
1788	149	8.2	2026-03-31	Most recent clinic measurement	2026-03-31 06:08:35.738318
1789	150	23.1	2026-01-13	\N	2026-03-31 06:08:35.851757
1790	150	23.1	2026-01-20	\N	2026-03-31 06:08:35.85432
1791	150	23	2026-01-27	\N	2026-03-31 06:08:35.856261
1792	150	23	2026-02-03	\N	2026-03-31 06:08:35.858621
1793	150	22.8	2026-02-10	\N	2026-03-31 06:08:35.86052
1794	150	22.9	2026-02-17	Mid-protocol review	2026-03-31 06:08:35.862937
1795	150	22.7	2026-02-24	\N	2026-03-31 06:08:35.864782
1796	150	22.7	2026-03-03	\N	2026-03-31 06:08:35.86714
1797	150	22.8	2026-03-10	\N	2026-03-31 06:08:35.868944
1798	150	22.7	2026-03-17	\N	2026-03-31 06:08:35.871405
1799	150	22.7	2026-03-24	\N	2026-03-31 06:08:35.87384
1800	150	22.5	2026-03-31	Most recent clinic measurement	2026-03-31 06:08:35.8758
1801	151	12.9	2026-01-13	\N	2026-03-31 06:08:35.990157
1802	151	13.1	2026-01-20	\N	2026-03-31 06:08:35.992171
1803	151	13.2	2026-01-27	\N	2026-03-31 06:08:35.994771
1804	151	13.5	2026-02-03	\N	2026-03-31 06:08:35.99721
1805	151	13.6	2026-02-10	\N	2026-03-31 06:08:35.999868
1806	151	13.7	2026-02-17	Mid-protocol review	2026-03-31 06:08:36.002166
1807	151	14	2026-02-24	\N	2026-03-31 06:08:36.004113
1808	151	14	2026-03-03	\N	2026-03-31 06:08:36.005917
1809	151	14.1	2026-03-10	\N	2026-03-31 06:08:36.008527
1810	151	14.3	2026-03-17	\N	2026-03-31 06:08:36.010805
1811	151	14.5	2026-03-24	\N	2026-03-31 06:08:36.013119
1812	151	14.6	2026-03-31	Most recent clinic measurement	2026-03-31 06:08:36.014897
1813	152	8.2	2026-01-13	\N	2026-03-31 06:08:36.130345
1814	152	8.3	2026-01-20	\N	2026-03-31 06:08:36.132412
1815	152	8.3	2026-01-27	\N	2026-03-31 06:08:36.134458
1816	152	8.1	2026-02-03	\N	2026-03-31 06:08:36.136544
1817	152	8.2	2026-02-10	\N	2026-03-31 06:08:36.138546
1818	152	8.1	2026-02-17	Mid-protocol review	2026-03-31 06:08:36.141169
1819	152	8.1	2026-02-24	\N	2026-03-31 06:08:36.143173
1820	152	7.9	2026-03-03	\N	2026-03-31 06:08:36.145223
1821	152	7.9	2026-03-10	\N	2026-03-31 06:08:36.147362
1822	152	7.9	2026-03-17	\N	2026-03-31 06:08:36.149804
1823	152	7.8	2026-03-24	\N	2026-03-31 06:08:36.152279
1824	152	7.7	2026-03-31	Most recent clinic measurement	2026-03-31 06:08:36.154692
1825	153	15.1	2026-01-13	\N	2026-03-31 06:08:36.270501
1826	153	15.1	2026-01-20	\N	2026-03-31 06:08:36.272515
1827	153	15.1	2026-01-27	\N	2026-03-31 06:08:36.274603
1828	153	15	2026-02-03	\N	2026-03-31 06:08:36.276985
1829	153	15	2026-02-10	\N	2026-03-31 06:08:36.279409
1830	153	14.8	2026-02-17	Mid-protocol review	2026-03-31 06:08:36.281482
1831	153	14.8	2026-02-24	\N	2026-03-31 06:08:36.284187
1832	153	14.8	2026-03-03	\N	2026-03-31 06:08:36.286776
1833	153	14.8	2026-03-10	\N	2026-03-31 06:08:36.290048
1834	153	14.7	2026-03-17	\N	2026-03-31 06:08:36.292024
1835	153	14.7	2026-03-24	\N	2026-03-31 06:08:36.294017
1836	153	14.6	2026-03-31	Most recent clinic measurement	2026-03-31 06:08:36.295758
1837	154	20.7	2026-01-13	\N	2026-03-31 06:08:36.407931
1838	154	20.8	2026-01-20	\N	2026-03-31 06:08:36.409955
1839	154	20.7	2026-01-27	\N	2026-03-31 06:08:36.412199
1840	154	20.7	2026-02-03	\N	2026-03-31 06:08:36.414149
1841	154	20.7	2026-02-10	\N	2026-03-31 06:08:36.416896
1842	154	20.5	2026-02-17	Mid-protocol review	2026-03-31 06:08:36.419049
1843	154	20.6	2026-02-24	\N	2026-03-31 06:08:36.42106
1844	154	20.5	2026-03-03	\N	2026-03-31 06:08:36.424348
1845	154	20.4	2026-03-10	\N	2026-03-31 06:08:36.644152
1846	154	20.4	2026-03-17	\N	2026-03-31 06:08:36.646966
1847	154	20.4	2026-03-24	\N	2026-03-31 06:08:36.649371
1848	154	20.3	2026-03-31	Most recent clinic measurement	2026-03-31 06:08:36.651746
1849	155	12	2026-01-13	\N	2026-03-31 06:08:36.770481
1850	155	12	2026-01-20	\N	2026-03-31 06:08:36.772305
1851	155	12.1	2026-01-27	\N	2026-03-31 06:08:36.774708
1852	155	12.4	2026-02-03	\N	2026-03-31 06:08:36.777055
1853	155	12.5	2026-02-10	\N	2026-03-31 06:08:36.779493
1854	155	12.7	2026-02-17	Mid-protocol review	2026-03-31 06:08:36.781523
1855	155	12.7	2026-02-24	\N	2026-03-31 06:08:36.783927
1856	155	13	2026-03-03	\N	2026-03-31 06:08:36.786176
1857	155	13.1	2026-03-10	\N	2026-03-31 06:08:36.789355
1858	155	13.2	2026-03-17	\N	2026-03-31 06:08:36.791349
1859	155	13.3	2026-03-24	\N	2026-03-31 06:08:36.793458
1860	155	13.5	2026-03-31	Most recent clinic measurement	2026-03-31 06:08:36.795519
1861	156	6.8	2026-01-13	\N	2026-03-31 06:08:36.907279
1862	156	6.9	2026-01-20	\N	2026-03-31 06:08:36.909608
1863	156	6.8	2026-01-27	\N	2026-03-31 06:08:36.911868
1864	156	6.8	2026-02-03	\N	2026-03-31 06:08:36.91421
1865	156	6.8	2026-02-10	\N	2026-03-31 06:08:36.916248
1866	156	6.7	2026-02-17	Mid-protocol review	2026-03-31 06:08:36.91853
1867	156	6.7	2026-02-24	\N	2026-03-31 06:08:36.920913
1868	156	6.5	2026-03-03	\N	2026-03-31 06:08:36.922915
1869	156	6.4	2026-03-10	\N	2026-03-31 06:08:36.924841
1870	156	6.4	2026-03-17	\N	2026-03-31 06:08:36.927148
1871	156	6.4	2026-03-24	\N	2026-03-31 06:08:36.929891
1872	156	6.3	2026-03-31	Most recent clinic measurement	2026-03-31 06:08:36.931766
\.


--
-- Name: doctors_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.doctors_id_seq', 2, true);


--
-- Name: foods_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.foods_id_seq', 62, true);


--
-- Name: ketone_readings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.ketone_readings_id_seq', 1248, true);


--
-- Name: kid_food_approvals_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.kid_food_approvals_id_seq', 1, false);


--
-- Name: kids_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.kids_id_seq', 157, true);


--
-- Name: library_meal_plan_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.library_meal_plan_items_id_seq', 317, true);


--
-- Name: library_meal_plans_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.library_meal_plans_id_seq', 48, true);


--
-- Name: meal_days_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.meal_days_id_seq', 5460, true);


--
-- Name: meal_entries_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.meal_entries_id_seq', 1, false);


--
-- Name: meal_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.meal_logs_id_seq', 780, true);


--
-- Name: meal_plan_assignment_history_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.meal_plan_assignment_history_id_seq', 1, true);


--
-- Name: meal_plan_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.meal_plan_items_id_seq', 1, false);


--
-- Name: meal_plans_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.meal_plans_id_seq', 1, false);


--
-- Name: meal_types_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.meal_types_id_seq', 9, true);


--
-- Name: medical_settings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.medical_settings_id_seq', 157, true);


--
-- Name: notes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.notes_id_seq', 156, true);


--
-- Name: parent_tokens_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.parent_tokens_id_seq', 2, true);


--
-- Name: recipe_ingredients_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.recipe_ingredients_id_seq', 519, true);


--
-- Name: recipes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.recipes_id_seq', 153, true);


--
-- Name: weight_records_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.weight_records_id_seq', 1872, true);


--
-- Name: doctors doctors_email_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.doctors
    ADD CONSTRAINT doctors_email_unique UNIQUE (email);


--
-- Name: doctors doctors_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.doctors
    ADD CONSTRAINT doctors_pkey PRIMARY KEY (id);


--
-- Name: doctors doctors_username_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.doctors
    ADD CONSTRAINT doctors_username_unique UNIQUE (username);


--
-- Name: foods foods_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.foods
    ADD CONSTRAINT foods_pkey PRIMARY KEY (id);


--
-- Name: ketone_readings ketone_readings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ketone_readings
    ADD CONSTRAINT ketone_readings_pkey PRIMARY KEY (id);


--
-- Name: kid_food_approvals kid_food_approvals_kid_id_food_id_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.kid_food_approvals
    ADD CONSTRAINT kid_food_approvals_kid_id_food_id_unique UNIQUE (kid_id, food_id);


--
-- Name: kid_food_approvals kid_food_approvals_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.kid_food_approvals
    ADD CONSTRAINT kid_food_approvals_pkey PRIMARY KEY (id);


--
-- Name: kids kids_kid_code_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.kids
    ADD CONSTRAINT kids_kid_code_unique UNIQUE (kid_code);


--
-- Name: kids kids_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.kids
    ADD CONSTRAINT kids_pkey PRIMARY KEY (id);


--
-- Name: library_meal_plan_items library_meal_plan_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.library_meal_plan_items
    ADD CONSTRAINT library_meal_plan_items_pkey PRIMARY KEY (id);


--
-- Name: library_meal_plans library_meal_plans_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.library_meal_plans
    ADD CONSTRAINT library_meal_plans_pkey PRIMARY KEY (id);


--
-- Name: meal_days meal_days_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.meal_days
    ADD CONSTRAINT meal_days_pkey PRIMARY KEY (id);


--
-- Name: meal_entries meal_entries_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.meal_entries
    ADD CONSTRAINT meal_entries_pkey PRIMARY KEY (id);


--
-- Name: meal_logs meal_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.meal_logs
    ADD CONSTRAINT meal_logs_pkey PRIMARY KEY (id);


--
-- Name: meal_plan_assignment_history meal_plan_assignment_history_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.meal_plan_assignment_history
    ADD CONSTRAINT meal_plan_assignment_history_pkey PRIMARY KEY (id);


--
-- Name: meal_plan_items meal_plan_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.meal_plan_items
    ADD CONSTRAINT meal_plan_items_pkey PRIMARY KEY (id);


--
-- Name: meal_plans meal_plans_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.meal_plans
    ADD CONSTRAINT meal_plans_pkey PRIMARY KEY (id);


--
-- Name: meal_type_recipes meal_type_recipes_meal_type_id_recipe_id_pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.meal_type_recipes
    ADD CONSTRAINT meal_type_recipes_meal_type_id_recipe_id_pk PRIMARY KEY (meal_type_id, recipe_id);


--
-- Name: meal_types meal_types_name_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.meal_types
    ADD CONSTRAINT meal_types_name_unique UNIQUE (name);


--
-- Name: meal_types meal_types_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.meal_types
    ADD CONSTRAINT meal_types_pkey PRIMARY KEY (id);


--
-- Name: medical_settings medical_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medical_settings
    ADD CONSTRAINT medical_settings_pkey PRIMARY KEY (id);


--
-- Name: notes notes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notes
    ADD CONSTRAINT notes_pkey PRIMARY KEY (id);


--
-- Name: parent_tokens parent_tokens_kid_id_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.parent_tokens
    ADD CONSTRAINT parent_tokens_kid_id_unique UNIQUE (kid_id);


--
-- Name: parent_tokens parent_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.parent_tokens
    ADD CONSTRAINT parent_tokens_pkey PRIMARY KEY (id);


--
-- Name: parent_tokens parent_tokens_token_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.parent_tokens
    ADD CONSTRAINT parent_tokens_token_unique UNIQUE (token);


--
-- Name: recipe_ingredients recipe_ingredients_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.recipe_ingredients
    ADD CONSTRAINT recipe_ingredients_pkey PRIMARY KEY (id);


--
-- Name: recipes recipes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.recipes
    ADD CONSTRAINT recipes_pkey PRIMARY KEY (id);


--
-- Name: weight_records weight_records_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.weight_records
    ADD CONSTRAINT weight_records_pkey PRIMARY KEY (id);


--
-- Name: ketone_readings ketone_readings_kid_id_kids_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ketone_readings
    ADD CONSTRAINT ketone_readings_kid_id_kids_id_fk FOREIGN KEY (kid_id) REFERENCES public.kids(id);


--
-- Name: kid_food_approvals kid_food_approvals_food_id_foods_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.kid_food_approvals
    ADD CONSTRAINT kid_food_approvals_food_id_foods_id_fk FOREIGN KEY (food_id) REFERENCES public.foods(id) ON DELETE CASCADE;


--
-- Name: kid_food_approvals kid_food_approvals_kid_id_kids_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.kid_food_approvals
    ADD CONSTRAINT kid_food_approvals_kid_id_kids_id_fk FOREIGN KEY (kid_id) REFERENCES public.kids(id) ON DELETE CASCADE;


--
-- Name: kids kids_current_meal_plan_id_library_meal_plans_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.kids
    ADD CONSTRAINT kids_current_meal_plan_id_library_meal_plans_id_fk FOREIGN KEY (current_meal_plan_id) REFERENCES public.library_meal_plans(id) ON DELETE SET NULL;


--
-- Name: kids kids_doctor_id_doctors_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.kids
    ADD CONSTRAINT kids_doctor_id_doctors_id_fk FOREIGN KEY (doctor_id) REFERENCES public.doctors(id);


--
-- Name: library_meal_plan_items library_meal_plan_items_plan_id_library_meal_plans_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.library_meal_plan_items
    ADD CONSTRAINT library_meal_plan_items_plan_id_library_meal_plans_id_fk FOREIGN KEY (plan_id) REFERENCES public.library_meal_plans(id);


--
-- Name: library_meal_plans library_meal_plans_doctor_id_doctors_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.library_meal_plans
    ADD CONSTRAINT library_meal_plans_doctor_id_doctors_id_fk FOREIGN KEY (doctor_id) REFERENCES public.doctors(id);


--
-- Name: meal_days meal_days_kid_id_kids_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.meal_days
    ADD CONSTRAINT meal_days_kid_id_kids_id_fk FOREIGN KEY (kid_id) REFERENCES public.kids(id);


--
-- Name: meal_entries meal_entries_kid_id_kids_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.meal_entries
    ADD CONSTRAINT meal_entries_kid_id_kids_id_fk FOREIGN KEY (kid_id) REFERENCES public.kids(id);


--
-- Name: meal_logs meal_logs_kid_id_kids_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.meal_logs
    ADD CONSTRAINT meal_logs_kid_id_kids_id_fk FOREIGN KEY (kid_id) REFERENCES public.kids(id);


--
-- Name: meal_plan_assignment_history meal_plan_assignment_history_doctor_id_doctors_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.meal_plan_assignment_history
    ADD CONSTRAINT meal_plan_assignment_history_doctor_id_doctors_id_fk FOREIGN KEY (doctor_id) REFERENCES public.doctors(id);


--
-- Name: meal_plan_assignment_history meal_plan_assignment_history_kid_id_kids_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.meal_plan_assignment_history
    ADD CONSTRAINT meal_plan_assignment_history_kid_id_kids_id_fk FOREIGN KEY (kid_id) REFERENCES public.kids(id) ON DELETE CASCADE;


--
-- Name: meal_plan_items meal_plan_items_plan_id_meal_plans_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.meal_plan_items
    ADD CONSTRAINT meal_plan_items_plan_id_meal_plans_id_fk FOREIGN KEY (plan_id) REFERENCES public.meal_plans(id);


--
-- Name: meal_plans meal_plans_kid_id_kids_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.meal_plans
    ADD CONSTRAINT meal_plans_kid_id_kids_id_fk FOREIGN KEY (kid_id) REFERENCES public.kids(id);


--
-- Name: meal_type_recipes meal_type_recipes_meal_type_id_meal_types_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.meal_type_recipes
    ADD CONSTRAINT meal_type_recipes_meal_type_id_meal_types_id_fk FOREIGN KEY (meal_type_id) REFERENCES public.meal_types(id) ON DELETE CASCADE;


--
-- Name: meal_type_recipes meal_type_recipes_recipe_id_recipes_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.meal_type_recipes
    ADD CONSTRAINT meal_type_recipes_recipe_id_recipes_id_fk FOREIGN KEY (recipe_id) REFERENCES public.recipes(id) ON DELETE CASCADE;


--
-- Name: medical_settings medical_settings_kid_id_kids_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medical_settings
    ADD CONSTRAINT medical_settings_kid_id_kids_id_fk FOREIGN KEY (kid_id) REFERENCES public.kids(id);


--
-- Name: notes notes_doctor_id_doctors_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notes
    ADD CONSTRAINT notes_doctor_id_doctors_id_fk FOREIGN KEY (doctor_id) REFERENCES public.doctors(id);


--
-- Name: notes notes_kid_id_kids_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notes
    ADD CONSTRAINT notes_kid_id_kids_id_fk FOREIGN KEY (kid_id) REFERENCES public.kids(id);


--
-- Name: parent_tokens parent_tokens_kid_id_kids_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.parent_tokens
    ADD CONSTRAINT parent_tokens_kid_id_kids_id_fk FOREIGN KEY (kid_id) REFERENCES public.kids(id) ON DELETE CASCADE;


--
-- Name: recipe_ingredients recipe_ingredients_recipe_id_recipes_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.recipe_ingredients
    ADD CONSTRAINT recipe_ingredients_recipe_id_recipes_id_fk FOREIGN KEY (recipe_id) REFERENCES public.recipes(id) ON DELETE CASCADE;


--
-- Name: recipes recipes_doctor_id_doctors_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.recipes
    ADD CONSTRAINT recipes_doctor_id_doctors_id_fk FOREIGN KEY (doctor_id) REFERENCES public.doctors(id) ON DELETE CASCADE;


--
-- Name: weight_records weight_records_kid_id_kids_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.weight_records
    ADD CONSTRAINT weight_records_kid_id_kids_id_fk FOREIGN KEY (kid_id) REFERENCES public.kids(id);


--
-- PostgreSQL database dump complete
--

\unrestrict bf87c9mH7QzXKGujFaDeGZaSHoZITyI09QQWplgZImcJLSzew5ZfSPn4VkbOE7t

