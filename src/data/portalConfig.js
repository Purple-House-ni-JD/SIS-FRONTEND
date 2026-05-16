export const portalNav = {
  admin: [
    { to: "/admin", end: true, label: "Dashboard" },
    { to: "/admin/users", label: "User management" },
    { to: "/admin/courses", label: "Courses" },
    { to: "/admin/enrollments", label: "Enrollments" },
    { to: "/admin/grades", label: "Grades" },
    { to: "/admin/announcements", label: "Announcements" },
  ],
  instructor: [
    { to: "/instructor", end: true, label: "Dashboard" },
    { to: "/instructor/courses", label: "Courses" },
    { to: "/instructor/grades", label: "Grades" },
    { to: "/instructor/announcements", label: "Announcements" },
    { to: "/instructor/profile", label: "Profile" },
  ],
  student: [
    { to: "/student", end: true, label: "Dashboard" },
    { to: "/student/grades", label: "Courses & grades" },
    { to: "/student/announcements", label: "Announcements" },
    { to: "/student/profile", label: "Profile" },
  ],
};

export function getPortalPath(role) {
  if (role === "student") return "/student";
  if (role === "instructor") return "/instructor";
  return "/admin";
}
