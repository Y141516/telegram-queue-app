import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const telegram_id = body.telegram_id;
    const first_name = body.first_name;

    if (!telegram_id) {
      return NextResponse.json(
        { error: "No telegram_id provided" },
        { status: 400 }
      );
    }

    // 1️⃣ Get all groups
    const { data: groups, error: groupsError } = await supabase
      .from("groups")
      .select("*");

    if (groupsError) {
      throw groupsError;
    }

    const matchedGroups: any[] = [];

    // 2️⃣ Check membership
    for (const group of groups || []) {
      const telegramUrl =
        "https://api.telegram.org/bot" +
        process.env.VERIFICATION_BOT_TOKEN +
        "/getChatMember?chat_id=" +
        group.telegram_chat_id +
        "&user_id=" +
        telegram_id;

      const res = await fetch(telegramUrl);
      const result = await res.json();

      if (result.ok) {
        const status = result.result.status;

        if (
          status === "member" ||
          status === "administrator" ||
          status === "creator"
        ) {
          matchedGroups.push(group);
        }
      }
    }

    // 3️⃣ Block if not in any group
    if (matchedGroups.length === 0) {
      return NextResponse.json(
        { error: "You are not a member of any authorized group." },
        { status: 403 }
      );
    }

    // 4️⃣ If multiple groups
    if (matchedGroups.length > 1) {
      return NextResponse.json({
        requiresGroupSelection: true,
        groups: matchedGroups,
      });
    }

    const selectedGroup = matchedGroups[0];

    // 5️⃣ Upsert user
    const { data: user, error: userError } = await supabase
      .from("users")
      .upsert(
        {
          telegram_id: telegram_id,
          first_name: first_name,
          group_id: selectedGroup.id,
        },
        { onConflict: "telegram_id" }
      )
      .select()
      .single();

    if (userError) {
      throw userError;
    }

    // 6️⃣ Get leaders
    const { data: leaders } = await supabase
      .from("leaders")
      .select("*")
      .eq("group_id", selectedGroup.id);

    // 7️⃣ Get queue settings
    const leaderIds = (leaders || []).map((l: any) => l.id);

    const { data: queueSettings } = await supabase
      .from("queue_settings")
      .select("*")
      .in("leader_id", leaderIds);

    // 8️⃣ Merge leader + queue
    const leadersWithQueue = (leaders || []).map((leader: any) => {
      const settings = (queueSettings || []).find(
        (qs: any) => qs.leader_id === leader.id
      );

      return {
        ...leader,
        is_open: settings ? settings.is_open : false,
        max_slots: settings ? settings.max_slots : 0,
        current_count: settings ? settings.current_count : 0,
      };
    });

    // 9️⃣ Calculate send button
    const availableLeaders = leadersWithQueue.filter(
      (l: any) => l.is_open && l.current_count < l.max_slots
    );

    const canSendMessage = availableLeaders.length > 0;

    return NextResponse.json({
      user,
      group: selectedGroup,
      leaders: leadersWithQueue,
      canSendMessage,
      requiresGroupSelection: false,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}