import { PortProfile } from "./PortProfile";
import { PortProfileId } from "./PortProfileId";

export class PortProfileContext {
  private readonly selectedProfile: PortProfile | undefined;
  private readonly allProfiles: PortProfile[];

  private constructor(
    selectedProfile: PortProfile | undefined,
    allProfiles: PortProfile[]
  ) {
    this.selectedProfile = selectedProfile;
    this.allProfiles = allProfiles;
  }

  public static index(
    profiles: PortProfile[],
    whitelist: PortProfileId | undefined
  ): PortProfileContext {
    profiles = profiles.sort(byCollateralAndLoanCountDesc);
    let selected = whitelist
      ? profiles.find((p) => p.getProfileId().equals(whitelist))
      : undefined;
    if (!selected && profiles.length) {
      selected = profiles[0];
    }
    return new PortProfileContext(selected, profiles);
  }

  public getSelectedProfile(): PortProfile | undefined {
    return this.selectedProfile;
  }

  public getAllProfiles(): PortProfile[] {
    return this.allProfiles;
  }
}

function byCollateralAndLoanCountDesc(a: PortProfile, b: PortProfile): number {
  const aCount = a.getCollaterals().length + a.getLoans().length;
  const bCount = b.getCollaterals().length + b.getLoans().length;
  return bCount - aCount;
}
