import type { NextPage } from "next";
import { H1 } from "../components/H1";
import PostForm from "../components/PostForm";
import { Button } from "../components/Button";
import { useState } from "react";
import { useStore } from "../state/store";

const Admin: NextPage = ({ }) => {
    const [showForm, setShowForm] = useState(false)
    const { session } = useStore()

    return (
        <section className="container py-36">
            <H1>Admin</H1>
            {showForm && session && <PostForm session={session}/>}
            <Button
                secondary={showForm}
                className="pt-4" 
                onClick={() => setShowForm(s => !s)}
            >
                {showForm ? "Cancel" : "New Post"}
            </Button>
        </section>
    );
};

export default Admin;
