-- Revised SQL (Final Version)
-- 'citizen_tier' does not exist, so we update 'role' and 'nickname' instead.

-- 1. Insert Admin Role into user_roles (RBAC)
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::public.app_role
FROM auth.users
WHERE email = 'info@corporatepranks.com'
ON CONFLICT (user_id, role) DO NOTHING;

-- 2. Update Profile (Display info & redundant role)
UPDATE public.profiles
SET nickname = 'Praetorian Admin', role = 'admin'::public.app_role
FROM auth.users
WHERE public.profiles.id = auth.users.id
AND auth.users.email = 'info@corporatepranks.com';

-- 3. Check the result
SELECT u.email, p.role as profile_role, ur.role as user_table_role, p.nickname
FROM auth.users u
JOIN public.profiles p ON u.id = p.id
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
WHERE u.email = 'info@corporatepranks.com';
