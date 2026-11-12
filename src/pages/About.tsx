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
          Three proposals are currently in front of the city: two in West Oakland and one near the Coliseum. Each would
          draw significant water and power, and each promises jobs and tax revenue in return.
        </p>
        <p className="body">
          This campaign is a space to learn, share what you think, and hear from neighbors — so that when the city
          decides, it knows where Oakland actually stands.
        </p>

      </div>
    </>
  );
}
