INSERT INTO public.store (store_name, address, phone,open_date)
VALUES (
    '旗舰店',
    '中国云南省香格里拉人民东路1号',
    '1235324994',
    '2020-1-1'
  );

INSERT INTO public.store (store_name, address, phone, open_date)
VALUES (
    '二号店',
    '中国云南省香格里拉解放西路9号',
    '19935324994',
    '2020-9-21'
  );

INSERT INTO public.admin(admin_name, password, is_super_admin)
	VALUES ('Admin', 'pwd', true);

INSERT INTO public.admin(admin_name, password, is_super_admin)
	VALUES ('store1Admin', 'pwd', false);
	
	INSERT INTO public.admin(admin_name, password, is_super_admin)
	VALUES ('store2Admin', 'pwd', false);

INSERT INTO public.credential( admin_id, store_id)
	VALUES ( 2, 1);
INSERT INTO public.credential( admin_id, store_id)
	VALUES ( 3, 2);