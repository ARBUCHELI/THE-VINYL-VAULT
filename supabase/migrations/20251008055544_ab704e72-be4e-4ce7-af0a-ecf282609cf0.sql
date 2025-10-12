-- Drop the existing admin-only delete policy
DROP POLICY IF EXISTS "Admins can delete posts" ON public.posts;

-- Create a new policy that allows authors to delete their own posts OR admins to delete any post
CREATE POLICY "Authors and admins can delete posts" 
ON public.posts 
FOR DELETE 
USING (
  (auth.uid() = author_id) OR 
  has_role(auth.uid(), 'admin'::app_role)
);