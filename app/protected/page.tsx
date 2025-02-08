import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Card } from "@/components/ui/card";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Fetch user profile data
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  // Fetch user projects
  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <div className="flex-1 flex flex-col gap-8 max-w-6xl px-4 py-8">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Profile Picture Section */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-48 h-48 rounded-full overflow-hidden bg-secondary">
            {profile?.avatar_url ? (
              <Image
                src={profile.avatar_url}
                alt="Profile"
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl text-muted-foreground">
                {user.email?.[0].toUpperCase()}
              </div>
            )}
          </div>
          <Button variant="outline">Update Profile Picture</Button>
        </div>

        {/* Profile Info Section */}
        <div className="flex-1 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-bold">{profile?.full_name || 'Add Your Name'}</h1>
            <p className="text-xl text-muted-foreground">{profile?.title || 'Add Your Title'}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{user.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Age</p>
              <p className="font-medium">{profile?.age || 'Not specified'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Location</p>
              <p className="font-medium">{profile?.location || 'Add location'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Available for hire</p>
              <p className="font-medium">{profile?.available_for_hire ? 'Yes' : 'No'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tech Stack Section */}
      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Tech Stack</h2>
        <div className="flex flex-wrap gap-2">
          {profile?.tech_stack?.map((tech: string) => (
            <span
              key={tech}
              className="px-3 py-1 bg-secondary rounded-full text-sm"
            >
              {tech}
            </span>
          )) || (
            <p className="text-muted-foreground">Add your tech stack</p>
          )}
        </div>
      </Card>

      {/* About Section */}
      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-4">About Me</h2>
        <p className="text-muted-foreground whitespace-pre-wrap">
          {profile?.bio || 'Tell us about yourself...'}
        </p>
      </Card>

      {/* Projects Section */}
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Projects</h2>
          <Button>Add New Project</Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects?.map((project) => (
            <Card key={project.id} className="flex flex-col">
              <div className="relative aspect-video w-full bg-secondary">
                {project.thumbnail_url && (
                  <Image
                    src={project.thumbnail_url}
                    alt={project.title}
                    fill
                    className="object-cover"
                  />
                )}
              </div>
              <div className="p-4 flex flex-col gap-2">
                <h3 className="text-xl font-semibold">{project.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {project.description}
                </p>
                <div className="flex justify-between items-center mt-4">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${project.published ? 'bg-green-500' : 'bg-yellow-500'}`} />
                    <span className="text-sm text-muted-foreground">
                      {project.published ? 'Published' : 'Draft'}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
          
          {(!projects || projects.length === 0) && (
            <Card className="flex items-center justify-center p-8 text-muted-foreground">
              No projects yet. Add your first project!
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
