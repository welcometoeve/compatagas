// Import from URL for Deno
import {
  createClient,
  SupabaseClient,
} from "https://esm.sh/@supabase/supabase-js@2.39.3";

console.log("Starting application...");

const supabaseUrl: string = "https://rzfprffcjagjztalfjhr.supabase.co";
const supabaseKey: string =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ6ZnByZmZjamFnanp0YWxmamhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU5OTA3MjAsImV4cCI6MjA0MTU2NjcyMH0.WQOeskWUDrfuoLbQeJylLRbYt1LeHzllRfpHgMntqcQ";

console.log(`Initializing Supabase client with URL: ${supabaseUrl}`);
const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);
console.log("Supabase client initialized");

interface PushNotificationResult {
  // Define the structure of the result based on the actual response
  // For example:
  id: string;
  status: string;
}

async function sendPushNotification(
  expoPushToken: string,
  message: string,
  title: string,
): Promise<PushNotificationResult> {
  console.log(`Sending push notification to token: ${expoPushToken}`);
  const response = await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      to: expoPushToken,
      sound: "default",
      title: title,
      body: message,
    }),
  });

  const result: PushNotificationResult = await response.json();
  console.log("Push notification sent, result:", result);
  return result;
}

Deno.serve(async (req: Request) => {
  console.log(`Received ${req.method} request`);

  if (req.method === "POST") {
    try {
      const { recipientId, message, title, notificationToken } = await req
        .json();
      console.log(
        `Received notification request for recipient: ${recipientId}`,
      );

      if (!notificationToken) {
        console.error("Failed to get recipient token");
        return new Response(
          JSON.stringify({ error: "Failed to get recipient token" }),
          { status: 400, headers: { "Content-Type": "application/json" } },
        );
      }

      console.log(`Retrieved notification token: ${notificationToken}`);

      const result = await sendPushNotification(
        notificationToken,
        message,
        title,
      );

      return new Response(
        JSON.stringify({ success: true, result }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      );
    } catch (error) {
      console.error("Error sending notification:", error);
      return new Response(
        JSON.stringify({
          error: "Failed to send notification",
          details: (error as Error).message,
        }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }
  } else {
    console.log("Method not allowed");
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { "Content-Type": "application/json" } },
    );
  }
});

console.log("Server is running and waiting for requests");
