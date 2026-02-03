-- Create function to increment post views atomically
CREATE OR REPLACE FUNCTION public.increment_post_views(post_id UUID)
RETURNS VOID
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.posts
  SET views = views + 1
  WHERE id = post_id;
$$;
