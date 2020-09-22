create table yudao.store(
    id SERIAL primary key,
    store_name character(16) NOT NULL,
    address text NOT NULL,
    phone character(16) NOT NULL
);

create table yudao.admin(
    id SERIAL primary key,
    admin_name character(16) NOT NULL,
    admin_pwd character(16) NOT NULL
);
create table yudao.storelogin(
    admin_id integer NOT NULL REFERENCES yudao.admin (id),
    store_id integer NOT NULL REFERENCES yudao.store (id),
    token character(64),
    primary key (admin_id,store_id)
);

create table yudao.member(
    id SERIAL primary key,
    member_card_id character(8) NOT NULL,
    name character(16) NOT NULL,
    gender smallint NOT NULL,
    phone character(16) NOT NULL,
    balance integer
);

create table yudao.technician(
    id SERIAL primary key,
    technician_display_id character(8) NOT NULL,
    name character(16) NOT NULL,
    gender smallint NOT NULL,
    phone character(16) NOT NULL,
    national_id character(24) NOT NULL,
    start_date date NOT NULL,
    leave_date date
);

create table yudao.service_room(
    id SERIAL primary key,
    room_name character(8) NOT NULL,
    total_beds integer
);

create table yudao.service(
    id SERIAL primary key,
    service_name character(20) NOT NULL,
    service_description text,
    service_price integer NOT NULL,
    service_duration integer NOT NULL
);

create table yudao.order(
    id SERIAL primary key,
    technician_id integer NOT NULL REFERENCES yudao.technician(id),
    room_id integer NOT NULL REFERENCES yudao.service_room(id),
    service_id integer NOT NULL REFERENCES yudao.service(id),
    bed_number integer NOT NULL,
    start_time timestamp NOT NULL,
    amount integer NOT NULL
);

create table yudao.topup(
    id SERIAL primary key,
    member_id integer NOT NULL REFERENCES yudao.member(id),
    ammount integer NOT NULL,
    topup_date timestamp
);

create table yudao.spend(
    id SERIAL primary key,
    spend_item text NOT NULL,
    spend_amount numeric NOT NULL,
    spend_date timestamp
);