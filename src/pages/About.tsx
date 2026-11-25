import { C, campaign, hosts } from '../data';
import { Avatar, Hero } from '../components/ui';

export function About() {
  return (
    <>
      <Hero title="About this campaign" />
      <div className="page page-prose">
        <h2 className="h2">Your Hosts</h2>
        <div className="host-row">
          {hosts.map((h) => (
            <span key={h.name} className="host">
              <Avatar color={C.orange} size={26} /> {h.name}
            </span>
          ))}
        </div>

        <h2 className="h2">What is this campaign about?</h2>
        <p className="body">{campaign.about}</p>
        <p className="body">
          The statements here come from an open poll and listening sessions held around the region. Neighbors added
          their own statements and voted on each other’s, and the votes sort people into opinion groups so we can see
          both where we differ and where we already agree.
        </p>
        <p className="body">
          This campaign is a space to learn, share what you think, and hear from neighbors — so that when leaders
          decide, they know where Central Oregon actually stands.
        </p>

      </div>
    </>
  );
}
